'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import SharedTripViewer from '../../../../components/SharedTripViewer'

export default function SharedTripPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [tripId, setTripId] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    if (params.tripId) {
      setTripId(params.tripId)
    }
    
    if (searchParams.get('token')) {
      setToken(searchParams.get('token'))
    }
  }, [params.tripId, searchParams])

  if (!tripId || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Invalid Share Link
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This share link is invalid or incomplete.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  return (
    <SharedTripViewer
      tripId={tripId}
      token={token}
      onClose={() => window.location.href = '/'}
    />
  )
}
