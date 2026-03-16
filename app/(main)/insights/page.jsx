'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/providers/useAuth'
import { db } from '@/lib/config/firebase'
import { collection, doc, getDocs, query, where, updateDoc } from 'firebase/firestore'
import { toast } from 'sonner'
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { format } from 'date-fns'
import Link from 'next/link'

const MONTHS_TO_SHOW = 6

function getMonthKey(date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM yyyy')
}

function getLastMonths(count) {
  const now = new Date()
  const months = []
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(format(d, 'MMM yyyy'))
  }
  return months
}

export default function InsightsPage() {
  const { user, profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    trips: 0,
    blogPosts: 0,
    activities: 0,
    totalSpent: 0,
    averageTripCost: 0,
    favoriteDestination: '',
    totalDaysTraveling: 0,
    recentTrips: [],
    allTrips: [],
    monthlyTrends: [],
    expenseBreakdown: [],
    activitiesByMonth: {},
  })

  const [goalInput, setGoalInput] = useState('')
  const [isSavingGoal, setIsSavingGoal] = useState(false)

  const currentMonthLabel = useMemo(() => {
    return getLastMonths(1)[0]
  }, [])

  const [selectedMonth, setSelectedMonth] = useState(currentMonthLabel)

  const goalNumber = Number(goalInput || 0)
  const currentMonthSpending = useMemo(() => {
    const trend = stats.monthlyTrends.find((t) => t.month === currentMonthLabel)
    return trend?.spending ?? 0
  }, [stats.monthlyTrends, currentMonthLabel])

  const goalProgress = goalNumber > 0 ? Math.min((currentMonthSpending / goalNumber) * 100, 100) : 0

  const selectedMonthDetails = useMemo(() => {
    if (!selectedMonth) return null

    const trend = stats.monthlyTrends.find((t) => t.month === selectedMonth) || {
      month: selectedMonth,
      trips: 0,
      spending: 0,
    }

    const activities = stats.activitiesByMonth?.[selectedMonth] ?? 0

    const tripsForMonth = (stats.allTrips || []).filter((trip) => {
      const createdAt = trip?.createdAt?.toDate ? trip.createdAt.toDate() : trip?.createdAt
      if (!createdAt) return false
      return getMonthKey(createdAt) === selectedMonth
    })

    const expenseCategories = tripsForMonth.reduce((acc, trip) => {
      const category = trip?.userSelection?.category || 'Other'
      const amount = Number(trip?.userSelection?.budget || 0)
      acc[category] = (acc[category] || 0) + amount
      return acc
    }, {})

    const expenseTotal = Object.values(expenseCategories).reduce((sum, value) => sum + value, 0)

    return {
      month: selectedMonth,
      trips: tripsForMonth,
      tripCount: tripsForMonth.length,
      spending: trend.spending,
      activities,
      goal: goalNumber,
      goalProgress: goalNumber > 0 ? Math.min((trend.spending / goalNumber) * 100, 100) : 0,
      expenseBreakdown: Object.entries(expenseCategories).map(([category, amount]) => ({
        category,
        amount,
        percentage: expenseTotal ? Math.round((amount / expenseTotal) * 100) : 0,
      })),
    }
  }, [selectedMonth, stats, goalNumber])

  const handleMonthClick = (data) => {
    if (!data?.activeLabel) return
    setSelectedMonth(data.activeLabel)
  }

  const handleSaveGoal = async () => {
    if (!user?.uid) return
    if (!goalNumber || goalNumber <= 0) {
      toast.error('Please enter a valid goal amount')
      return
    }

    setIsSavingGoal(true)
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        monthlyBudgetGoal: goalNumber,
        savingsGoal: goalNumber,
      })
      toast.success('Monthly budget goal saved')
      await refreshProfile()
    } catch (err) {
      console.error('Error saving goal:', err)
      toast.error('Could not save budget goal')
    } finally {
      setIsSavingGoal(false)
    }
  }

  useEffect(() => {
    if (!profile) return
    const existingGoal = profile.monthlyBudgetGoal ?? profile.savingsGoal
    if (existingGoal !== undefined && existingGoal !== null) {
      setGoalInput(String(existingGoal))
    }
  }, [profile?.monthlyBudgetGoal, profile?.savingsGoal])

  useEffect(() => {
    const fetchInsights = async () => {
      if (!user?.uid) {
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        // Trips
        const tripsRef = collection(db, 'trips')
        const tripsQuery = query(tripsRef, where('userId', '==', user.uid))
        const tripsSnapshot = await getDocs(tripsQuery)
        const trips = tripsSnapshot
          .docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => {
            const aDate = a?.createdAt?.toDate ? a.createdAt.toDate() : new Date(0)
            const bDate = b?.createdAt?.toDate ? b.createdAt.toDate() : new Date(0)
            return bDate - aDate
          })

        const totalSpent = trips.reduce((acc, trip) => {
          const amount = Number(trip?.userSelection?.budget || 0)
          return acc + amount
        }, 0)

        const totalDaysTraveling = trips.reduce((acc, trip) => {
          const days = Number(trip?.userSelection?.days || 0)
          return acc + days
        }, 0)

        const destinationCounts = trips.reduce((acc, trip) => {
          const dest = trip?.userSelection?.destination || 'Unknown'
          acc[dest] = (acc[dest] || 0) + 1
          return acc
        }, {})
        const favoriteDestination =
          Object.entries(destinationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''

        const averageTripCost = trips.length ? totalSpent / trips.length : 0

        const lastMonths = getLastMonths(MONTHS_TO_SHOW)
        const monthMap = lastMonths.reduce((acc, month) => {
          acc[month] = { month, trips: 0, spending: 0 }
          return acc
        }, {})

        trips.forEach((trip) => {
          const createdAt = trip?.createdAt?.toDate ? trip.createdAt.toDate() : new Date()
          const monthKey = getMonthKey(createdAt)
          if (!monthMap[monthKey]) {
            monthMap[monthKey] = { month: monthKey, trips: 0, spending: 0 }
          }
          monthMap[monthKey].trips += 1
          monthMap[monthKey].spending += Number(trip?.userSelection?.budget || 0)
        })

        const monthlyTrends = Object.values(monthMap)

        const categoryMap = trips.reduce((acc, trip) => {
          const category = trip?.userSelection?.category || 'Other'
          const amount = Number(trip?.userSelection?.budget || 0)
          acc[category] = (acc[category] || 0) + amount
          return acc
        }, {})

        const expenseBreakdown = Object.entries(categoryMap)
          .map(([category, amount]) => ({ category, amount }))
          .sort((a, b) => b.amount - a.amount)

        const expenseTotal = expenseBreakdown.reduce((sum, item) => sum + item.amount, 0)
        const expensePercent = expenseBreakdown.map((item) => ({
          ...item,
          percentage: expenseTotal ? Math.round((item.amount / expenseTotal) * 100) : 0,
        }))

        // Blog posts
        const blogPostsRef = collection(db, 'blog_posts')
        const blogPostsQuery = query(blogPostsRef, where('authorUid', '==', user.uid))
        const blogPostsSnapshot = await getDocs(blogPostsQuery)
        const blogPostsCount = blogPostsSnapshot.size

        // Activities
        const activitiesRef = collection(db, 'users', user.uid, 'activities')
        const activitiesSnapshot = await getDocs(activitiesRef)

        const activitiesByMonth = activitiesSnapshot.docs.reduce((acc, doc) => {
          const data = doc.data()
          const createdAt = data?.createdAt?.toDate ? data.createdAt.toDate() : data?.createdAt
          if (!createdAt) return acc
          const month = getMonthKey(createdAt)
          acc[month] = (acc[month] || 0) + 1
          return acc
        }, {})

        const activitiesCount =
          typeof profile?.activityCount === 'number'
            ? profile.activityCount
            : activitiesSnapshot.size

        // Recent trips (last 5)
        const recentTrips = trips.slice(0, 5).map((trip) => ({
          id: trip.id,
          destination: trip?.userSelection?.destination || 'Unknown',
          cost: Number(trip?.userSelection?.budget || 0),
          date:
            trip?.userSelection?.startDate ||
            (trip?.createdAt?.toDate ? trip.createdAt.toDate().toISOString().slice(0, 10) : ''),
          rating: trip?.rating || 0,
        }))

        setStats({
          trips: trips.length,
          blogPosts: blogPostsCount,
          activities: activitiesCount,
          totalSpent,
          averageTripCost,
          favoriteDestination,
          totalDaysTraveling,
          recentTrips,
          allTrips: trips,
          monthlyTrends,
          expenseBreakdown: expensePercent,
          activitiesByMonth,
        })
      } catch (error) {
        console.error('Error fetching insights:', error)
        toast.error('Failed to load insights. Please try again.')
      } finally {
        setLoading(false)
      }
    }


    fetchInsights()
    console.log(stats)
  }, [user?.uid, profile?.activityCount])

  const chartData = useMemo(() => {
    const months = getLastMonths(MONTHS_TO_SHOW)
    return months.map((month) => {
      const trend = stats.monthlyTrends.find((t) => t.month === month)
      return {
        month,
        trips: trend?.trips ?? 0,
        spending: trend?.spending ?? 0,
        goal: goalNumber,
      }
    })
  }, [stats.monthlyTrends, goalNumber])

  const pieColors = ['#60a5fa', '#34d399', '#f97316', '#a855f7', '#f43f5e', '#fb7185']

  return (
    <div className="space-y-6 p-2">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Travel Insights</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Analyze your travel patterns, blog activity, and budget progress.
        </p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {loading ? '—' : stats.trips}
          </div>
          <div className="text-md text-gray-600 dark:text-gray-400">Trips</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {loading ? '—' : `$${stats.totalSpent.toLocaleString()}`}
          </div>
          <div className="text-md text-gray-600 dark:text-gray-400">Total Spent</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {loading ? '—' : stats.blogPosts}
          </div>
          <div className="text-md text-gray-600 dark:text-gray-400">Blog Posts</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            {loading ? '—' : stats.activities}
          </div>
          <div className="text-md text-gray-600 dark:text-gray-400">Activities</div>
        </Card>
      </div>

      {/* Monthly Budget Goal */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Budget Goal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-2 md:col-span-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Track how much you are spending this month and keep your budget on target.
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="w-full md:w-48 px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                placeholder="Monthly budget goal"
              />
              <Button onClick={handleSaveGoal} isLoading={isSavingGoal} disabled={isSavingGoal}>
                Save Goal
              </Button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">This month</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                ${currentMonthSpending.toLocaleString()}
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {goalNumber > 0
                ? `${goalProgress.toFixed(1)}% of $${goalNumber.toLocaleString()}`
                : 'Set a goal to start tracking progress.'}
            </div>
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Spending Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                onClick={handleMonthClick}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="spending" name="Spending" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                {goalNumber > 0 && (
                  <Line
                    type="monotone"
                    dataKey="goal"
                    name="Goal"
                    stroke="#10b981"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Expense Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.expenseBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  outerRadius={90}
                  innerRadius={45}
                  paddingAngle={2}
                  label={(entry) => `${entry.category}: ${entry.percentage}%`}
                >
                  {stats.expenseBreakdown.map((entry, index) => (
                    <Cell key={entry.category} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

     

      {/* Recent Trips Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Trips
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Destination</th>
                <th className="text-center hidden md:inline-block py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cost</th>
                <th className="text-center py-2 hidden lg:inline-block text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700 dark:text-gray-300 ml-auto">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentTrips.map((trip) => (
                <tr key={trip.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 text-sm text-gray-900 dark:text-white">{trip.destination}</td>
                  <td className="py-3 text-center text-sm hidden md:inline-block text-gray-700 dark:text-gray-300">${trip.cost.toLocaleString()}</td>
                  <td className="py-3 text-center text-sm hidden lg:inline-block text-gray-700 dark:text-gray-300">{trip.date}</td>
                  <td className="py-3 text-sm ml-auto">

                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/trips/${trip.id}`}>
                        View
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          AI Recommendations
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Cost Optimization</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Consider traveling in shoulder season to save 15-20% on accommodation costs.
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">🎯 Next Destination</h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              Based on your preferences, we recommend exploring Portugal for your next trip.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
