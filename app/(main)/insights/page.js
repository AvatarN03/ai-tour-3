'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function InsightsPage() {
  const [activePeriod, setActivePeriod] = useState('month')
  const [travelStats] = useState({
    totalTrips: 12,
    totalSpent: 8500,
    averageTripCost: 708,
    favoriteDestination: 'Paris',
    totalDaysTraveling: 45,
    savingsGoal: 10000,
    currentSavings: 6500
  })

  const [recentTrips] = useState([
    { destination: 'Paris', cost: 800, rating: 4.8, date: '2024-01' },
    { destination: 'Bali', cost: 1200, rating: 4.9, date: '2023-12' },
    { destination: 'Tokyo', cost: 1500, rating: 4.7, date: '2023-11' },
    { destination: 'New York', cost: 900, rating: 4.6, date: '2023-10' }
  ])

  const [expenseBreakdown] = useState([
    { category: 'Accommodation', percentage: 40, amount: 3400 },
    { category: 'Transportation', percentage: 25, amount: 2125 },
    { category: 'Food & Dining', percentage: 20, amount: 1700 },
    { category: 'Activities', percentage: 10, amount: 850 },
    { category: 'Shopping', percentage: 5, amount: 425 }
  ])

  const [monthlyTrends] = useState([
    { month: 'Jan', trips: 1, spending: 800 },
    { month: 'Feb', trips: 0, spending: 0 },
    { month: 'Mar', trips: 1, spending: 1200 },
    { month: 'Apr', trips: 2, spending: 1800 },
    { month: 'May', trips: 1, spending: 900 },
    { month: 'Jun', trips: 0, spending: 0 }
  ])

  const savingsProgress = (travelStats.currentSavings / travelStats.savingsGoal) * 100

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Travel Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Analyze your travel patterns and spending habits
        </p>
      </div>

      {/* Time Period Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Period:</span>
        {['week', 'month', 'quarter', 'year'].map((period) => (
          <button
            key={period}
            onClick={() => setActivePeriod(period)}
            className={`px-3 py-1 text-sm rounded-lg ${
              activePeriod === period
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {travelStats.totalTrips}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Trips
          </div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            ${travelStats.totalSpent.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Spent
          </div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            ${travelStats.averageTripCost}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Avg. Trip Cost
          </div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            {travelStats.totalDaysTraveling}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Days Traveling
          </div>
        </Card>
      </div>

      {/* Savings Progress */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Travel Savings Goal
        </h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Progress: ${travelStats.currentSavings.toLocaleString()} / ${travelStats.savingsGoal.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {savingsProgress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-green-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${savingsProgress}%` }}
          ></div>
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline">
            Update Goal
          </Button>
        </div>
      </Card>

      {/* Expense Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Expense Breakdown
          </h3>
          <div className="space-y-3">
            {expenseBreakdown.map((expense) => (
              <div key={expense.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)` }}
                  ></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {expense.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    ${expense.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {expense.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Trends
          </h3>
          <div className="space-y-3">
            {monthlyTrends.map((trend) => (
              <div key={trend.month} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300 w-12">
                  {trend.month}
                </span>
                <div className="flex-1 mx-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 w-16">
                      {trend.trips} trips
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(trend.spending / 2000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white w-20 text-right">
                  ${trend.spending.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Trips Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Trips Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Destination
                </th>
                <th className="text-left py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cost
                </th>
                <th className="text-left py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rating
                </th>
                <th className="text-left py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date
                </th>
                <th className="text-left py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recentTrips.map((trip, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 text-sm text-gray-900 dark:text-white">
                    {trip.destination}
                  </td>
                  <td className="py-3 text-sm text-gray-700 dark:text-gray-300">
                    ${trip.cost.toLocaleString()}
                  </td>
                  <td className="py-3 text-sm text-gray-700 dark:text-gray-300">
                    ⭐ {trip.rating}
                  </td>
                  <td className="py-3 text-sm text-gray-700 dark:text-gray-300">
                    {trip.date}
                  </td>
                  <td className="py-3 text-sm">
                    <Button variant="outline" size="sm">
                      View Details
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
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 Cost Optimization
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Consider traveling in shoulder season to save 15-20% on accommodation costs.
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
              🎯 Next Destination
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              Based on your preferences, we recommend exploring Portugal for your next trip.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
