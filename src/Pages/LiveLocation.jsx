import { useState, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '../config/firebase'
import LiveMap from '../components/dashboard/LiveMap'
import LocationDetailsPanel from './LocationDetailsPanel'
import { mockCurrentLocation } from '../data/mockDashboardData'
import apiClient from '../api/client'

function LiveLocation() {
  const [currentLocation, setCurrentLocation] = useState(mockCurrentLocation)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isSubscribed = true

    // 1. Listen to live_location
    const liveRef = ref(db, 'live_location')
    const unsubscribeLive = onValue(
      liveRef,
      (snapshot) => {
        if (!isSubscribed) return
        const val = snapshot.val()
        if (val) {
          const dev = val.device1 || val['netra-helmet-01'] || val['netra_sarthi_01'] || {}
          const lat = dev.latitude !== undefined ? Number(dev.latitude) : (val.latitude !== undefined ? Number(val.latitude) : null)
          const lng = dev.longitude !== undefined ? Number(dev.longitude) : (val.longitude !== undefined ? Number(val.longitude) : null)

          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            setCurrentLocation({
              status: val.status || 'active',
              latitude: lat,
              longitude: lng,
              address: dev.address || val.address || `Live Position (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`,
              accuracy: Number(dev.accuracy || val.accuracy || 4),
              updatedAt: val.updatedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              speed: Number(dev.speed || val.speed || 0),
              battery: Number(dev.battery || val.battery || 85),
            })
            setLoading(false)
            return
          }
        }

        // If live_location does not have coordinates, check latest in location_history
        checkHistoryFallback()
      },
      (err) => {
        console.warn('Firebase RTDB live error, falling back to history/api:', err)
        checkHistoryFallback()
      }
    )

    // Check location_history for the most recent coordinate
    const checkHistoryFallback = () => {
      const historyRef = ref(db, 'location_history')
      onValue(
        historyRef,
        (histSnap) => {
          if (!isSubscribed) return
          const histVal = histSnap.val()
          if (histVal) {
            const devHist = histVal.device1 || histVal
            const keys = Object.keys(devHist).sort((a, b) => {
              const ta = Number(devHist[a]?.timestamp || a) || 0
              const tb = Number(devHist[b]?.timestamp || b) || 0
              return tb - ta
            })
            if (keys.length > 0) {
              const latest = devHist[keys[0]]
              const lat = Number(latest.latitude ?? latest.lat)
              const lng = Number(latest.longitude ?? latest.lng)
              if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                setCurrentLocation((prev) => ({
                  ...prev,
                  status: 'active',
                  latitude: lat,
                  longitude: lng,
                  address: latest.address || `Live Position (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`,
                  updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                }))
                setLoading(false)
                return
              }
            }
          }
          fetchApiFallback()
        },
        () => fetchApiFallback(),
        { onlyOnce: true }
      )
    }

    const fetchApiFallback = async () => {
      try {
        const { data } = await apiClient.get('/locations/live')
        if (isSubscribed && data?.latitude && data?.longitude) {
          setCurrentLocation(data)
          setLoading(false)
          return
        }
      } catch {
        // use initial mockCurrentLocation
      }
      if (isSubscribed) setLoading(false)
    }

    return () => {
      isSubscribed = false
      unsubscribeLive()
    }
  }, [])

  const handleShare = async () => {
    const { latitude, longitude, address } = currentLocation
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`
    const text = `Live location: ${address} (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Live Location', text, url: mapsUrl })
        return
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${text} ${mapsUrl}`)
        alert('Location link copied to clipboard')
        return
      }
      const textarea = document.createElement('textarea')
      textarea.value = `${text} ${mapsUrl}`
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      alert('Location link copied to clipboard')
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('Share failed:', error)
      }
    }
  }

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${currentLocation.latitude},${currentLocation.longitude}`
    window.open(url, '_blank')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 md:px-8 pt-4 pb-6 h-auto lg:h-[calc(100vh-88px)]">
      <div className="lg:col-span-2 h-full">
        <LiveMap
          latitude={currentLocation.latitude}
          longitude={currentLocation.longitude}
          accuracy={currentLocation.accuracy}
          zoom={16}
        />
      </div>

      <LocationDetailsPanel
        address={currentLocation.address}
        isLive={currentLocation.status === 'active'}
        accuracy={currentLocation.accuracy}
        latitude={Number(currentLocation.latitude?.toFixed(6) || currentLocation.latitude)}
        longitude={Number(currentLocation.longitude?.toFixed(6) || currentLocation.longitude)}
        updatedAt={currentLocation.updatedAt}
        speed={currentLocation.speed}
        battery={currentLocation.battery}
        onShare={handleShare}
        onGetDirections={handleDirections}
        onAddSafeZone={() => alert('Safe zone added at current coordinates')}
      />
    </div>
  )
}

export default LiveLocation
