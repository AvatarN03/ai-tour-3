'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState, useRef, useCallback } from 'react'

import { Button }   from '@/components/ui/button'
import { Card }     from '@/components/ui/card'
import { FieldLabel } from '@/components/features/trips/FieldLabel'

// Shared constants — same source as CreateTripForm, no duplication
import { categories, initialForm } from '@/lib/constants'
import LocationComplete from '@/components/features/trips/LocationComplete'



// Leaflet must never SSR
const MapView = dynamic(() => import('@/components/features/discover/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-700 text-sm">
      Loading map…
    </div>
  ),
})

// Only the fields relevant to discovery (subset of initialForm)
const DISCOVER_FIELDS = {
  source:      initialForm.source,
  destination: initialForm.destination,
  category:    initialForm.category,
  budget:      initialForm.budget,
  days:        initialForm.days,
  persons:     initialForm.persons,
}

export default function DiscoverPage() {
  const router = useRouter()
  const mapRef = useRef(null)

  const [filters, setFilters]   = useState(DISCOVER_FIELDS)
  const [loading, setLoading]   = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError]       = useState('')

  // ── Handlers ──────────────────────────────────────────────────────────────
  // Works for both <input>/<select> onChange AND LocationComplete's synthetic event
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }, [error])

  const handleSearch = useCallback(async () => {
    const { source, destination } = filters
    if (!source.trim() || !destination.trim()) {
      setError('Please enter both a departure city and a destination.')
      return
    }
    setError('')
    setLoading(true)
    setSearched(false)
    try {
      await mapRef.current?.showRoute(source.trim(), destination.trim())
      setSearched(true)
    } catch (err) {
      console.error(err)
      setError('Could not load the route. Please check the place names and try again.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  const handleClear = () => {
    setFilters(DISCOVER_FIELDS)
    setSearched(false)
    setError('')
    mapRef.current?.clearRoute()
  }

  // Passes all non-empty filters as query params — keys already match initialForm
  const handleProceed = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, String(v)) })
    router.push(`/trips/create-trip?${params.toString()}`)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Discover Destinations
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Enter your route and preferences — the map will show the way.
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Trip Filters
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* From — reuses LocationComplete exactly as in CreateTripForm */}
          <div>
            <FieldLabel label="From" required />
            <LocationComplete
              name="source"
              value={filters.source}
              onChange={handleChange}
              placeholder="e.g. Mumbai"
              error={error && !filters.source ? 'Required' : ''}
            />
          </div>

          {/* To */}
          <div>
            <FieldLabel label="To" required />
            <LocationComplete
              name="destination"
              value={filters.destination}
              onChange={handleChange}
              placeholder="e.g. Paris"
              error={error && !filters.destination ? 'Required' : ''}
            />
          </div>

          {/* Category — same `categories` array as CreateTripForm */}
          <div>
            <FieldLabel label="Category" />
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <FieldLabel label="Budget (approx)" />
            <input
              type="number"
              name="budget"
              value={filters.budget}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 50000"
              className="w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Duration */}
          <div>
            <FieldLabel label="Duration (days)" />
            <input
              type="number"
              name="days"
              value={filters.days}
              onChange={handleChange}
              min="1"
              max="7"
              placeholder="e.g. 3"
              className="w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Travelers */}
          <div>
            <FieldLabel label="Travelers" />
            <input
              type="number"
              name="persons"
              value={filters.persons}
              onChange={handleChange}
              min="1"
              max="10"
              placeholder="e.g. 2"
              className="w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching…' : 'Search & Show Route'}
          </Button>
          <Button variant="outline" onClick={handleClear} disabled={loading}>
            Clear
          </Button>
        </div>
      </Card>

      {/* Full-width map */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Route Map
        </h3>
        <MapView ref={mapRef} className="w-full h-[520px]" />
      </div>

      {/* Proceed CTA — only shown after a successful route search */}
      {searched && (
        <Card className="p-5 border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                ✈️ &nbsp;{filters.source} → {filters.destination}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {[
                  filters.category && `${filters.category}`,
                  filters.days     && `${filters.days} days`,
                  filters.budget   && `Budget: ${filters.budget}`,
                  filters.persons  && `${filters.persons} traveler(s)`,
                ].filter(Boolean).join(' · ') || 'Ready to plan your trip'}
              </p>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleProceed}
            >
              Plan this Trip →
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}