'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

// import MapStub from '../../../components/MapStub'

export default function DiscoverPage() {
  const [searchFilters, setSearchFilters] = useState({
    source: '',
    destination: '',
    category: '',
    budget: '',
    days: '',
    persons: ''
  })

  const [searchResults] = useState([
    {
      id: 1,
      title: 'Paris City Break',
      destination: 'Paris, France',
      category: 'City',
      budget: '$800',
      days: '3',
      rating: 4.8,
      image: '🗼'
    },
    {
      id: 2,
      title: 'Tropical Paradise',
      destination: 'Bali, Indonesia',
      category: 'Beach',
      budget: '$1200',
      days: '7',
      rating: 4.9,
      image: '🏖️'
    },
    {
      id: 3,
      title: 'Alpine Adventure',
      destination: 'Swiss Alps',
      category: 'Mountain',
      budget: '$1500',
      days: '5',
      rating: 4.7,
      image: '🏔️'
    }
  ])

  const handleFilterChange = (e) => {
    setSearchFilters({
      ...searchFilters,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Discover Destinations
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Find your perfect destination with AI-powered recommendations
        </p>
      </div>

      {/* Search Filters */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Search Filters
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From
            </label>
            <input
              type="text"
              name="source"
              value={searchFilters.source}
              onChange={handleFilterChange}
              placeholder="Departure city"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <input
              type="text"
              name="destination"
              value={searchFilters.destination}
              onChange={handleFilterChange}
              placeholder="Destination"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={searchFilters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="beach">Beach</option>
              <option value="city">City</option>
              <option value="mountain">Mountain</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Budget
            </label>
            <select
              name="budget"
              value={searchFilters.budget}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Any Budget</option>
              <option value="500">Under $500</option>
              <option value="1000">Under $1000</option>
              <option value="2000">Under $2000</option>
              <option value="5000">Under $5000</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration
            </label>
            <select
              name="days"
              value={searchFilters.days}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Any Duration</option>
              <option value="1">1-2 days</option>
              <option value="3">3-5 days</option>
              <option value="7">1 week</option>
              <option value="14">2 weeks</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Travelers
            </label>
            <select
              name="persons"
              value={searchFilters.persons}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Any Number</option>
              <option value="1">1 person</option>
              <option value="2">2 people</option>
              <option value="4">3-4 people</option>
              <option value="6">5+ people</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Button className="mr-2">
            Search Destinations
          </Button>
          <Button variant="outline">
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Map View */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Map View
          </h3>
          {/* <MapStub className="h-96" /> */}
        </div>

        {/* Search Results */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Search Results
          </h3>
          <div className="space-y-4">
            {searchResults.map((result) => (
              <Card key={result.id} className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{result.image}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {result.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {result.destination}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{result.category}</span>
                      <span>{result.budget}</span>
                      <span>{result.days} days</span>
                      <span>⭐ {result.rating}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

