'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import { collection, doc, getDocs, query, where, updateDoc } from 'firebase/firestore'
import { toast } from 'sonner'
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from 'recharts'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/useAuth'
import { db } from '@/lib/config/firebase'
import { getLastMonths, getMonthKey } from '@/lib/utils'
import { MONTHS_TO_SHOW } from '@/lib/constants'

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 ${className}`} />
)

const StatCard = ({ value, label, icon, color, loading, delay = '' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 shadow-[0_2px_0_0_#3b82f6] hover:shadow-[0_4px_24px_rgba(59,130,246,0.1)]',
    green: 'bg-green-100 dark:bg-green-900/30 shadow-[0_2px_0_0_#22c55e] hover:shadow-[0_4px_24px_rgba(34,197,94,0.1)]',
    purple: 'bg-purple-100 dark:bg-purple-900/30 shadow-[0_2px_0_0_#a855f7] hover:shadow-[0_4px_24px_rgba(168,85,247,0.1)]',
    orange: 'bg-orange-100 dark:bg-orange-900/30 shadow-[0_2px_0_0_#f97316] hover:shadow-[0_4px_24px_rgba(249,115,22,0.1)]',
  }

  const valueClasses = {
    blue: 'text-blue-700 dark:text-blue-300',
    green: 'text-green-700 dark:text-green-300',
    purple: 'text-purple-700 dark:text-purple-300',
    orange: 'text-orange-700 dark:text-orange-300',
  }

  const labelClasses = {
    blue: 'text-blue-500 dark:text-blue-400',
    green: 'text-green-500 dark:text-green-400',
    purple: 'text-purple-500 dark:text-purple-400',
    orange: 'text-orange-500 dark:text-orange-400',
  }

  const iconClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300',
    green: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300',
    purple: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300',
    orange: 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300',
  }

  return (
    <div className={`relative rounded-2xl p-7 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 ${colorClasses[color]} ${delay}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 ${iconClasses[color]}`}>
        {icon}
      </div>
      <div className={`font-serif text-4xl leading-none tracking-tight mb-1 ${valueClasses[color]}`}>
        {loading ? <Skeleton className="h-9 w-20" /> : value}
      </div>
      <div className={`text-xs font-medium tracking-widest uppercase ${labelClasses[color]}`}>{label}</div>
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10 bg-current" />
    </div>
  )
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.name.toLowerCase().includes('spend') || p.name.toLowerCase().includes('goal')
            ? `$${Number(p.value).toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  )
}

export default function InsightsPage() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    trips: 0, blogPosts: 0, activities: 0, totalSpent: 0,
    averageTripCost: 0, favoriteDestination: '', totalDaysTraveling: 0,
    recentTrips: [], allTrips: [], monthlyTrends: [],
    expenseBreakdown: [], activitiesByMonth: {},
  })

  const [goalInput, setGoalInput] = useState('')
  const [isSavingGoal, setIsSavingGoal] = useState(false)

  const currentMonthLabel = useMemo(() => getLastMonths(1)[0], [])

  const goalNumber = Number(goalInput || 0)
  const currentMonthSpending = useMemo(() => {
    const trend = stats.monthlyTrends.find((t) => t.month === currentMonthLabel)
    return trend?.spending ?? 0
  }, [stats.monthlyTrends, currentMonthLabel])

  const goalProgress = goalNumber > 0 ? Math.min((currentMonthSpending / goalNumber) * 100, 100) : 0

  const handleSaveGoal = async () => {
    if (!user?.uid) return
    if (!goalNumber || goalNumber <= 0) { toast.error('Please enter a valid goal amount'); return }
    setIsSavingGoal(true)
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        monthlyBudgetGoal: goalNumber, savingsGoal: goalNumber,
      })
      toast.success('Monthly budget goal saved')
    } catch (err) {
      console.error(err); toast.error('Could not save budget goal')
    } finally { setIsSavingGoal(false) }
  }

  useEffect(() => {
    if (!profile) return
    const existingGoal = profile.monthlyBudgetGoal ?? profile.savingsGoal
    if (existingGoal != null) setGoalInput(String(existingGoal))
  }, [profile?.monthlyBudgetGoal, profile?.savingsGoal])

  useEffect(() => {
    const fetchInsights = async () => {
      if (!user?.uid) { setLoading(false); return }
      setLoading(true)
      try {
        const tripsRef = collection(db, 'users', user.uid, 'trips')
        const tripsSnapshot = await getDocs(query(tripsRef))
        const trips = tripsSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))

        const totalSpent = trips.reduce((a, t) => a + Number(t?.userSelection?.budget || 0), 0)
        const totalDaysTraveling = trips.reduce((a, t) => a + Number(t?.userSelection?.days || 0), 0)

        const destCounts = trips.reduce((a, t) => {
          const d = t?.userSelection?.destination || 'Unknown'
          a[d] = (a[d] || 0) + 1; return a
        }, {})
        const favoriteDestination = Object.entries(destCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
        const averageTripCost = trips.length ? totalSpent / trips.length : 0

        const lastMonths = getLastMonths(MONTHS_TO_SHOW)
        const monthMap = lastMonths.reduce((a, m) => { a[m] = { month: m, trips: 0, spending: 0 }; return a }, {})
        trips.forEach((t) => {
          const d = t?.createdAt?.toDate ? t.createdAt.toDate() : new Date()
          const k = getMonthKey(d)
          if (!monthMap[k]) monthMap[k] = { month: k, trips: 0, spending: 0 }
          monthMap[k].trips += 1
          monthMap[k].spending += Number(t?.userSelection?.budget || 0)
        })
        const monthlyTrends = Object.values(monthMap)

        const categoryMap = trips.reduce((a, t) => {
          const cat = t?.userSelection?.category || 'Other'
          a[cat] = (a[cat] || 0) + Number(t?.userSelection?.budget || 0); return a
        }, {})
        const expenseTotal = Object.values(categoryMap).reduce((s, v) => s + v, 0)
        const expenseBreakdown = Object.entries(categoryMap)
          .map(([category, amount]) => ({ category, amount, percentage: expenseTotal ? Math.round((amount / expenseTotal) * 100) : 0 }))
          .sort((a, b) => b.amount - a.amount)

        const blogSnapshot = await getDocs(query(collection(db, 'blog_posts'), where('authorUid', '==', user.uid)))
        const activitiesSnapshot = await getDocs(collection(db, 'users', user.uid, 'activities'))
        const activitiesByMonth = activitiesSnapshot.docs.reduce((a, d) => {
          const data = d.data()
          const ca = data?.createdAt?.toDate ? data.createdAt.toDate() : data?.createdAt
          if (!ca) return a
          const m = getMonthKey(ca); a[m] = (a[m] || 0) + 1; return a
        }, {})

        const activitiesCount = typeof profile?.activityCount === 'number' ? profile.activityCount : activitiesSnapshot.size
        const recentTrips = trips.slice(0, 5).map((t) => ({
          id: t.id,
          destination: t?.userSelection?.destination || 'Unknown',
          cost: Number(t?.userSelection?.budget || 0),
          date: t?.userSelection?.startDate || (t?.createdAt?.toDate ? t.createdAt.toDate().toISOString().slice(0, 10) : ''),
          rating: t?.rating || 0,
        }))

        setStats({
          trips: trips.length, blogPosts: blogSnapshot.size, activities: activitiesCount,
          totalSpent, averageTripCost, favoriteDestination, totalDaysTraveling,
          recentTrips, allTrips: trips, monthlyTrends, expenseBreakdown, activitiesByMonth,
        })
      } catch (err) {
        console.error(err); toast.error('Failed to load insights. Please try again.')
      } finally { setLoading(false) }
    }
    fetchInsights()
  }, [user?.uid, profile?.activityCount])

  const chartData = useMemo(() => {
    const months = getLastMonths(MONTHS_TO_SHOW)
    return months.map((month) => {
      const trend = stats.monthlyTrends.find((t) => t.month === month)
      return { month, trips: trend?.trips ?? 0, spending: trend?.spending ?? 0, goal: goalNumber }
    })
  }, [stats.monthlyTrends, goalNumber])

  const pieColors = ['#6366f1', '#22d3ee', '#f97316', '#a855f7', '#f43f5e', '#10b981']

  return (
    <div className="space-y-7 p-2 pb-12">
      {/* Page header */}
      <div className="animate-[fadeIn_0.4s_ease_both]">
        <h1 className="font-serif text-4xl text-gray-900 dark:text-white leading-tight">
          Travel Insights
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Your travel patterns, blog activity & budget — all in one place.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard value={stats.trips} label="Total Trips" icon="✈️" color="blue" loading={loading} delay="animate-[fadeIn_0.4s_ease_both_0.05s]" />
        <StatCard value={`$${stats.totalSpent.toLocaleString()}`} label="Total Spent" icon="💳" color="green" loading={loading} delay="animate-[fadeIn_0.4s_ease_both_0.1s]" />
        <StatCard value={stats.blogPosts} label="Blog Posts" icon="✍️" color="purple" loading={loading} delay="animate-[fadeIn_0.4s_ease_both_0.15s]" />
        <StatCard value={stats.activities} label="Activities" icon="🎯" color="orange" loading={loading} delay="animate-[fadeIn_0.4s_ease_both_0.2s]" />
      </div>

      {/* Secondary info strip */}
      {!loading && (stats.favoriteDestination || stats.totalDaysTraveling > 0) && (
        <div className="flex flex-wrap gap-3 animate-[fadeIn_0.4s_ease_both_0.2s]">
          {stats.favoriteDestination && (
            <span className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 font-medium">
              <span>📍</span> Favourite: {stats.favoriteDestination}
            </span>
          )}
          {stats.totalDaysTraveling > 0 && (
            <span className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800 font-medium">
              <span>🌍</span> {stats.totalDaysTraveling} days on the road
            </span>
          )}
          {stats.trips > 0 && (
            <span className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800 font-medium">
              <span>💰</span> Avg. ${Math.round(stats.averageTripCost).toLocaleString()} / trip
            </span>
          )}
        </div>
      )}

      {/* Monthly budget goal */}
      <div className="bg-white dark:bg-gray-900/50 border border-black/5 dark:border-white/5 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all animate-[fadeIn_0.4s_ease_both_0.25s]">
        <h2 className="font-serif text-lg tracking-tight text-gray-900 dark:text-white mb-5">
          Monthly Budget Goal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Set a monthly spending target and watch your progress in real time.
            </p>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number" min={0} value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder="e.g. 2000"
                  className="pl-7 pr-3 py-2.5 w-40 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                />
              </div>
              <Button
                onClick={handleSaveGoal} disabled={isSavingGoal}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 h-10 font-medium"
              >
                {isSavingGoal ? 'Saving…' : 'Save Goal'}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Spent this month</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                ${currentMonthSpending.toLocaleString()}
                {goalNumber > 0 && (
                  <span className="font-normal text-gray-400 dark:text-gray-500"> / ${goalNumber.toLocaleString()}</span>
                )}
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-600 ease-out ${goalProgress >= 90
                    ? 'bg-gradient-to-r from-orange-500 to-red-500'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}
                style={{ width: `${goalProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
              <span>{goalNumber > 0 ? `${goalProgress.toFixed(1)}% used` : 'Set a goal to track progress'}</span>
              {goalNumber > 0 && goalProgress < 100 && (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  ${(goalNumber - currentMonthSpending).toLocaleString()} remaining
                </span>
              )}
              {goalNumber > 0 && goalProgress >= 100 && (
                <span className="text-red-500 font-medium">Over budget</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900/50 border border-black/5 dark:border-white/5 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all animate-[fadeIn_0.4s_ease_both_0.25s]">
          <h2 className="font-serif text-lg tracking-tight text-gray-900 dark:text-white mb-5">
            Monthly Spending
          </h2>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 6, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="spending" name="Spending" stroke="#6366f1"
                  strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#6366f1' }} />
                {goalNumber > 0 && (
                  <Line type="monotone" dataKey="goal" name="Goal" stroke="#10b981"
                    strokeDasharray="5 5" strokeWidth={2} dot={false} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900/50 border border-black/5 dark:border-white/5 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all animate-[fadeIn_0.4s_ease_both_0.3s]">
          <h2 className="font-serif text-lg tracking-tight text-gray-900 dark:text-white mb-5">
            Expense Breakdown
          </h2>
          {stats.expenseBreakdown.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-600 gap-2">
              <span className="text-4xl">🗂️</span>
              <p className="text-sm">No expense data yet</p>
            </div>
          ) : (
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.expenseBreakdown} dataKey="amount" nameKey="category"
                    outerRadius={85} innerRadius={50} paddingAngle={3}
                    label={({ category, percentage }) => `${category} ${percentage}%`}
                    labelLine={{ stroke: '#d1d5db', strokeWidth: 1 }}>
                    {stats.expenseBreakdown.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Recent trips */}
      <div className="bg-white dark:bg-gray-900/50 border border-black/5 dark:border-white/5 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all animate-[fadeIn_0.4s_ease_both_0.3s]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-lg tracking-tight text-gray-900 dark:text-white">
            Recent Trips
          </h2>
          <Link href="/trips" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
            View all →
          </Link>
        </div>

        {stats.recentTrips.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-gray-400 gap-2">
            <span className="text-4xl">🗺️</span>
            <p className="text-sm">No trips recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-[11px] font-semibold tracking-wide uppercase text-gray-400 dark:text-gray-500 px-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                    Destination
                  </th>
                  <th className="text-center text-[11px] font-semibold tracking-wide uppercase text-gray-400 dark:text-gray-500 px-3 pb-3 border-b border-gray-100 dark:border-gray-800 hidden md:table-cell">
                    Cost
                  </th>
                  <th className="text-center text-[11px] font-semibold tracking-wide uppercase text-gray-400 dark:text-gray-500 px-3 pb-3 border-b border-gray-100 dark:border-gray-800 hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-right text-[11px] font-semibold tracking-wide uppercase text-gray-400 dark:text-gray-500 px-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTrips.map((trip, i) => (
                  <tr
                    key={trip.id}
                    className="animate-[fadeIn_0.4s_ease_both] group"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <td className="px-3 py-3 text-sm border-b border-gray-50 dark:border-gray-800/60 group-last:border-0">
                      <span className="inline-flex items-center gap-1.5 font-medium text-gray-900 dark:text-gray-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" />
                        {trip.destination}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center border-b border-gray-50 dark:border-gray-800/60 group-last:border-0 hidden md:table-cell">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                        ${trip.cost.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-xs text-gray-400 dark:text-gray-500 border-b border-gray-50 dark:border-gray-800/60 group-last:border-0 hidden lg:table-cell">
                      {trip.date}
                    </td>
                    <td className="px-3 py-3 text-right border-b border-gray-50 dark:border-gray-800/60 group-last:border-0">
                      <Button
                        variant="ghost" size="sm" asChild
                        className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg text-xs font-medium h-8 px-3"
                      >
                        <Link href={`/trips/${trip.id}`}>View →</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>



      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}