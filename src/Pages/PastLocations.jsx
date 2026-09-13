import { useState, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '../config/firebase'
import LiveMap from '../components/dashboard/LiveMap'
import LocationFilterTabs from '../components/pastLocations/LocationFilterTabs'
import HistoryList from '../components/pastLocations/HistoryList'
import { mockLocationHistory } from '../data/mockDashboardData'
import apiClient from '../api/client'

const filters = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'All', value: 'all' },
]

function formatTime(ms) {
  const dateObj = new Date(ms)
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function processHistoryData(data) {
  if (!data || typeof data !== 'object') return []

  const rawList = []
  const values = Object.values(data)
  const isNested = values.some(v => v && typeof v === 'object' && v.latitude === undefined && v.lat === undefined)

  if (isNested) {
    for (const [devKey, devVal] of Object.entries(data)) {
      if (devVal && typeof devVal === 'object') {
        for (const [k, v] of Object.entries(devVal)) {
          if (v && typeof v === 'object') {
            const lat = Number(v.latitude ?? v.lat)
            const lng = Number(v.longitude ?? v.lng ?? v.lon)
            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
              rawList.push({
                id: `${devKey}_${k}`,
                deviceId: devKey,
                ...v,
                latitude: lat,
                longitude: lng,
                rawTime: Number(v.timestamp || k) || 0,
              })
            }
          }
        }
      }
    }
  } else {
    for (const [k, v] of Object.entries(data)) {
      if (v && typeof v === 'object') {
        const lat = Number(v.latitude ?? v.lat)
        const lng = Number(v.longitude ?? v.lng ?? v.lon)
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          rawList.push({
            id: k,
            ...v,
            latitude: lat,
            longitude: lng,
            rawTime: Number(v.timestamp || k) || 0,
          })
        }
      }
    }
  }

  if (rawList.length === 0) return []

  // Sort newest first
  rawList.sort((a, b) => (b.rawTime || 0) - (a.rawTime || 0))

  const newestRaw = rawList[0]?.rawTime || Date.now()
  const newestMs = newestRaw > 1e11 ? newestRaw : newestRaw * 1000
  const ONE_DAY_MS = 24 * 60 * 60 * 1000
  const ONE_WEEK_MS = 7 * ONE_DAY_MS

  return rawList.map((entry, idx) => {
    const ms = entry.rawTime ? (entry.rawTime > 1e11 ? entry.rawTime : entry.rawTime * 1000) : Date.now()
    const diff = newestMs - ms

    let period = 'all'
    if (diff <= ONE_DAY_MS * 2) {
      period = 'today'
    } else if (diff <= ONE_WEEK_MS) {
      period = 'week'
    }

    let address = entry.address
    if (!address) {
      address = `GPS Track (${entry.latitude.toFixed(4)}° N, ${entry.longitude.toFixed(4)}° E)`
    }

    return {
      id: entry.id || `loc_${idx + 1}`,
      latitude: entry.latitude,
      longitude: entry.longitude,
      accuracy: Number(entry.accuracy || 8),
      address,
      timestamp: formatTime(ms),
      rawTimestamp: ms,
      period,
      altitude: entry.altitude,
      satellites: entry.satellites,
      google_maps: entry.google_maps || `https://maps.google.com/?q=${entry.latitude},${entry.longitude}`,
    }
  })
}

function PastLocations() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [allLocations, setAllLocations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isSubscribed = true

    // 1. Direct Realtime Database listener
    const historyRef = ref(db, 'location_history')
    const unsubscribe = onValue(
      historyRef,
      (snapshot) => {
        if (!isSubscribed) return
        const val = snapshot.val()
        if (val) {
          const parsed = processHistoryData(val)
          if (parsed.length > 0) {
            setAllLocations(parsed)
            setSelectedId((prev) => prev || parsed[0]?.id)
            setLoading(false)
            return
          }
        }
        // Fallback to API if RTDB returns empty
        fallbackFetch()
      },
      (err) => {
        console.warn('Firebase RTDB history error, falling back to API:', err)
        fallbackFetch()
      }
    )

    const fallbackFetch = async () => {
      try {
        const { data } = await apiClient.get('/locations/history?period=all')
        if (isSubscribed && data?.entries?.length > 0) {
          setAllLocations(data.entries)
          setSelectedId((prev) => prev || data.entries[0]?.id)
          setLoading(false)
          return
        }
      } catch {
        // use mock data as ultimate fallback
      }
      if (isSubscribed) {
        setAllLocations(mockLocationHistory)
        setSelectedId((prev) => prev || mockLocationHistory[0]?.id)
        setLoading(false)
      }
    }

    return () => {
      isSubscribed = false
      unsubscribe()
    }
  }, [])

  const filteredEntries = allLocations.filter((entry) => {
    if (activeFilter === 'all') return true
    return entry.period === activeFilter
  })

  // If filtered is empty for 'today' or 'week', fallback to most recent locations
  const displayEntries = filteredEntries.length > 0
    ? filteredEntries
    : allLocations.slice(0, activeFilter === 'today' ? 30 : 100)

  const selectedEntry = displayEntries.find((entry) => entry.id === selectedId) || displayEntries[0]

  // Extract chronological route points for polyline (oldest first)
  const routePoints = [...displayEntries]
    .sort((a, b) => (a.rawTimestamp || 0) - (b.rawTimestamp || 0))
    .filter((e) => !isNaN(e.latitude) && !isNaN(e.longitude))
    .map((e) => [e.latitude, e.longitude])

  return (
    <div className="px-4 md:px-8 pt-4 pb-6 flex flex-col gap-4 h-auto lg:h-[calc(100vh-88px)]">
      <div className="flex items-center justify-between">
        <LocationFilterTabs filters={filters} activeFilter={activeFilter} onChange={setActiveFilter} />
        <span className="text-xs text-text-secondary">
          {loading ? 'Loading coordinates...' : `${allLocations.length} locations recorded`}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        <div className="lg:col-span-2 h-full">
          {selectedEntry ? (
            <LiveMap
              latitude={selectedEntry.latitude}
              longitude={selectedEntry.longitude}
              accuracy={selectedEntry.accuracy}
              zoom={16}
              routePoints={routePoints}
            />
          ) : (
            <div className="glass-card rounded-card h-full flex items-center justify-center text-text-secondary text-sm">
              {loading ? 'Loading GPS data from Firebase...' : 'No location selected'}
            </div>
          )}
        </div>

        <HistoryList
          entries={displayEntries}
          selectedId={selectedEntry?.id}
          onSelectEntry={setSelectedId}
        />
      </div>
    </div>
  )
}

export default PastLocations