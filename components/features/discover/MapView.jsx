'use client'

import { THUNDERFOREST_KEY } from '@/lib/constants'
import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react'



const MODES = [
  { id: 'flight', icon: '✈️', label: 'Flight', color: '#7c3aed', weight: 3, dash: '10,7' },
  { id: 'drive',  icon: '🚗', label: 'Drive',  color: '#2563eb', weight: 5, dash: null   },
  { id: 'bus',    icon: '🚌', label: 'Bus',    color: '#16a34a', weight: 5, dash: '10,5' },
  { id: 'train',  icon: '🚂', label: 'Train',  color: '#dc2626', weight: 5, dash: '16,5' },
  { id: 'ferry',  icon: '⛴️', label: 'Ferry',  color: '#0891b2', weight: 3, dash: '6,8'  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Nominatim geocode */
async function geocode(placeName) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`
  const res  = await fetch(url, { headers: { 'Accept-Language': 'en' } })
  const data = await res.json()
  if (!data.length) return null
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), display: data[0].display_name }
}

/** OSRM road route → [[lat,lng], ...] */
async function fetchRoadRoute(from, to, profile = 'driving') {
  const url =
    `https://router.project-osrm.org/route/v1/${profile}/` +
    `${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
  const res  = await fetch(url)
  const data = await res.json()
  if (data.code !== 'Ok') return null
  return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
}

/**
 * Great-circle arc between two points (spherical linear interpolation).
 * Returns n+1 [lat,lng] waypoints — the mathematically correct flight path.
 */
function greatCircleArc(from, to, n = 120) {
  const toRad = d => (d * Math.PI) / 180
  const toDeg = r => (r * 180) / Math.PI

  const φ1 = toRad(from.lat), λ1 = toRad(from.lng)
  const φ2 = toRad(to.lat),   λ2 = toRad(to.lng)

  const dφ = φ2 - φ1
  const dλ = λ2 - λ1
  const a  = Math.sin(dφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2
  const d  = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  if (d < 0.001) return [[from.lat, from.lng], [to.lat, to.lng]]

  const points = []
  for (let i = 0; i <= n; i++) {
    const f = i / n
    const A = Math.sin((1 - f) * d) / Math.sin(d)
    const B = Math.sin(f * d)       / Math.sin(d)
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2)
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2)
    const z = A * Math.sin(φ1)                 + B * Math.sin(φ2)
    points.push([
      toDeg(Math.atan2(z, Math.sqrt(x ** 2 + y ** 2))),
      toDeg(Math.atan2(y, x)),
    ])
  }
  return points
}

/**
 * Resolve route coordinates for a given mode.
 * - flight / ferry → great-circle arc  (no road needed, works across oceans)
 * - drive / bus    → OSRM driving
 * - train          → OSRM driving as best approximation; falls back to arc
 */
async function resolveRoute(from, to, modeId) {
  switch (modeId) {
    case 'flight':
    case 'ferry':
      return greatCircleArc(from, to)

    case 'drive':
    case 'bus': {
      const coords = await fetchRoadRoute(from, to, 'driving')
      return coords ?? greatCircleArc(from, to) // fallback for cross-water
    }

    case 'train': {
      const coords = await fetchRoadRoute(from, to, 'driving')
      return coords ?? greatCircleArc(from, to)
    }

    default:
      return greatCircleArc(from, to)
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
const MapView = forwardRef(function MapView({ className = '' }, ref) {
  const containerRef  = useRef(null)
  const leafletRef    = useRef(null)          // { L, map }
  const layersRef     = useRef({ from: null, to: null, route: null })
  const lastPointsRef = useRef(null)          // { from, to } last geocoded — for re-draw on mode change
  const modeRef       = useRef('flight')      // kept in sync with activeMode state

  const [activeMode, setActiveMode] = useState('flight')
  const [routeLoading, setRouteLoading] = useState(false)

  // ── Internal: draw route layer only (markers already exist) ───────────────
  async function drawRoute(from, to, modeId) {
    if (!leafletRef.current) return
    const { L, map } = leafletRef.current
    const mode = MODES.find(m => m.id === modeId) ?? MODES[0]

    // Remove existing route polyline
    if (layersRef.current.route) {
      layersRef.current.route.remove()
      layersRef.current.route = null
    }

    setRouteLoading(true)
    try {
      const coords = await resolveRoute(from, to, modeId)
      if (!coords) return

      layersRef.current.route = L.polyline(coords, {
        color:     mode.color,
        weight:    mode.weight,
        opacity:   0.85,
        dashArray: mode.dash,
        lineJoin:  'round',
        lineCap:   'round',
      }).addTo(map)

      map.fitBounds(layersRef.current.route.getBounds(), { padding: [50, 50] })
    } finally {
      setRouteLoading(false)
    }
  }

  // ── Imperative API exposed to parent ──────────────────────────────────────
  useImperativeHandle(ref, () => ({
    async showRoute(sourceName, destName) {
      if (!leafletRef.current) return
      const { L, map } = leafletRef.current

      clearLayers()

      const [from, to] = await Promise.all([geocode(sourceName), geocode(destName)])
      if (!from) { alert(`Could not find: "${sourceName}"`); return }
      if (!to)   { alert(`Could not find: "${destName}"`);   return }

      lastPointsRef.current = { from, to }

      // Pill-style marker icon
      const makeIcon = (color, label) =>
        L.divIcon({
          className: '',
          html: `<div style="
            display:flex;align-items:center;gap:5px;
            background:#fff;border:2px solid ${color};border-radius:999px;
            padding:3px 10px;font-size:11px;font-weight:700;color:${color};
            box-shadow:0 2px 8px rgba(0,0,0,.22);white-space:nowrap">
            <span style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0"></span>
            ${label}
          </div>`,
          iconAnchor: [0, 14],
        })

      layersRef.current.from = L.marker([from.lat, from.lng], { icon: makeIcon('#16a34a', 'Start') })
        .addTo(map)
        .bindPopup(`<b>Start</b><br>${from.display.split(',').slice(0, 3).join(', ')}`)

      layersRef.current.to = L.marker([to.lat, to.lng], { icon: makeIcon('#dc2626', 'End') })
        .addTo(map)
        .bindPopup(`<b>End</b><br>${to.display.split(',').slice(0, 3).join(', ')}`)

      // Snap map to both markers immediately while route loads
      map.fitBounds([[from.lat, from.lng], [to.lat, to.lng]], { padding: [60, 60], maxZoom: 7 })

      await drawRoute(from, to, modeRef.current)
    },

    clearRoute() {
      clearLayers()
      lastPointsRef.current = null
      leafletRef.current?.map.setView([20, 0], 2)
    },
  }))

  // ── Mode switch handler ───────────────────────────────────────────────────
  const handleModeChange = async (modeId) => {
    modeRef.current = modeId
    setActiveMode(modeId)
    if (lastPointsRef.current) {
      const { from, to } = lastPointsRef.current
      await drawRoute(from, to, modeId)
    }
  }

  // ── Clear helper ─────────────────────────────────────────────────────────
  function clearLayers() {
    const l = layersRef.current
    ;['from', 'to', 'route'].forEach(k => { if (l[k]) { l[k].remove(); l[k] = null } })
  }

  // ── Init Leaflet (StrictMode-safe) ────────────────────────────────────────
  useEffect(() => {
    let mounted = true

    ;(async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')
      if (!mounted) return

      const container = containerRef.current
      if (container._leaflet_id) container._leaflet_id = null
      if (leafletRef.current?.map) { leafletRef.current.map.remove(); leafletRef.current = null }

      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(container, { center: [20, 0], zoom: 2, zoomControl: true, scrollWheelZoom: true })

      const tileDefs = {
        Atlas:    `https://api.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=${THUNDERFOREST_KEY}`,
        Outdoors: `https://api.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=${THUNDERFOREST_KEY}`,
        Landscape:`https://api.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=${THUNDERFOREST_KEY}`,
        Transport:`https://api.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=${THUNDERFOREST_KEY}`,
      }
      const attribution =
        'Maps © <a href="https://www.thunderforest.com">Thunderforest</a>, ' +
        'Data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'

      const baseLayers = Object.fromEntries(
        Object.entries(tileDefs).map(([name, url]) => [name, L.tileLayer(url, { attribution, maxZoom: 22 })])
      )
      baseLayers.Atlas.addTo(map)
      L.control.layers(baseLayers).addTo(map)

      if (mounted) leafletRef.current = { L, map }
    })()

    return () => {
      mounted = false
      if (leafletRef.current?.map) { leafletRef.current.map.remove(); leafletRef.current = null }
    }
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────
  const activeModeData = MODES.find(m => m.id === activeMode)

  return (
    <div className={`relative rounded-xl h-[350px] md:h-[520px] overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}
        >

      {/* Leaflet map container */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* ── Travel Mode Selector — floating panel ── */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-1
                      bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm
                      border border-gray-200 dark:border-gray-700
                      rounded-full px-2 py-1.5 shadow-lg">
        {MODES.map(mode => {
          const isActive = activeMode === mode.id
          return (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              title={mode.label}
              className={`
                flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                transition-all duration-150 select-none
                ${isActive
                  ? 'text-white shadow-md scale-105'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
              `}
              style={isActive ? { background: mode.color } : {}}
            >
              <span className="text-sm leading-none">{mode.icon}</span>
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── Route loading spinner ── */}
      {routeLoading && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]
                        flex items-center gap-2 bg-white/90 dark:bg-gray-900/90
                        backdrop-blur-sm border border-gray-200 dark:border-gray-700
                        rounded-full px-4 py-2 shadow-lg text-xs font-medium text-gray-700 dark:text-gray-300">
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Drawing {activeModeData?.label.toLowerCase()} route…
        </div>
      )}

      {/* ── Legend for active route style ── */}
      {!routeLoading && lastPointsRef.current && activeModeData && (
        <div className="absolute bottom-4 left-3 z-[1000]
                        flex items-center gap-2
                        bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm
                        border border-gray-200 dark:border-gray-700
                        rounded-lg px-3 py-1.5 shadow text-xs text-gray-700 dark:text-gray-200">
          {/* Miniature line preview */}
          <svg width="28" height="8" viewBox="0 0 28 8">
            <line
              x1="0" y1="4" x2="28" y2="4"
              stroke={activeModeData.color}
              strokeWidth={activeModeData.id === 'flight' || activeModeData.id === 'ferry' ? 2 : 3}
              strokeDasharray={activeModeData.dash ?? ''}
              strokeLinecap="round"
            />
          </svg>
          <span style={{ color: activeModeData.color }} className="font-semibold">
            {activeModeData.icon} {activeModeData.label} route
          </span>
        </div>
      )}
    </div>
  )
})

export default MapView