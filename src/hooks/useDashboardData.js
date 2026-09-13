import { useState, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '../config/firebase'
import apiClient from '../api/client'
import { mockCurrentLocation } from '../data/mockDashboardData'

// Live location hook with Firebase RTDB + SSE stream + API fallback
export function useLiveLocation() {
  const [location, setLocation] = useState(mockCurrentLocation)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isSubscribed = true
    let eventSource = null

    // 1. Direct Firebase Realtime Database Listener
    const liveRef = ref(db, 'live_location')
    const unsubscribeFirebase = onValue(
      liveRef,
      (snapshot) => {
        if (!isSubscribed) return
        const val = snapshot.val()
        if (val) {
          const dev = val.device1 || val['netra-helmet-01'] || val['netra_sarthi_01'] || {}
          const lat = dev.latitude !== undefined ? Number(dev.latitude) : (val.latitude !== undefined ? Number(val.latitude) : null)
          const lng = dev.longitude !== undefined ? Number(dev.longitude) : (val.longitude !== undefined ? Number(val.longitude) : null)

          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            setLocation({
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
      },
      (err) => {
        console.warn('Firebase RTDB hook warning:', err)
      }
    )

    // 2. Fetch initial from API as fallback
    const fetchInitial = async () => {
      try {
        const { data } = await apiClient.get('/locations/live')
        if (isSubscribed && data?.latitude && data?.longitude) {
          setLocation(data)
        }
      } catch (err) {
        console.warn('Using cached location:', err.message)
      } finally {
        if (isSubscribed) setLoading(false)
      }
    }

    fetchInitial()

    // 3. Establish SSE stream if available
    try {
      const token = localStorage.getItem('ns_access_token')
      const baseUrl = apiClient.defaults.baseURL || '/api'
      const streamUrl = `${baseUrl}/locations/live/stream${token ? `?token=${token}` : ''}`

      eventSource = new EventSource(streamUrl)
      eventSource.addEventListener('location_update', (e) => {
        try {
          const updated = JSON.parse(e.data)
          if (isSubscribed && updated?.latitude) setLocation(updated)
        } catch (parseErr) {
          console.error('SSE parse error:', parseErr)
        }
      })

      eventSource.onerror = () => {
        if (eventSource) eventSource.close()
      }
    } catch (sseErr) {
      console.warn('SSE not available:', sseErr.message)
    }

    return () => {
      isSubscribed = false
      unsubscribeFirebase()
      if (eventSource) eventSource.close()
    }
  }, [])

  return { location, loading }
}

// Settings hook
export function useSettings() {
  const [settings, setSettings] = useState({
    notifications: {
      caretakerAlerts: true,
      lowBattery: true,
      weeklySummary: false,
    },
    locationPrefs: {
      highAccuracyMode: true,
      safeZoneAlerts: true,
    },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await apiClient.get('/settings')
        setSettings(data)
      } catch (err) {
        console.warn('Using local settings:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const updateNotification = async (key, value) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        notifications: { ...prev.notifications, [key]: value },
      }
      apiClient.put('/settings', updated).catch(() => {})
      return updated
    })
  }

  const updateLocationPref = async (key, value) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        locationPrefs: { ...prev.locationPrefs, [key]: value },
      }
      apiClient.put('/settings', updated).catch(() => {})
      return updated
    })
  }

  return { settings, loading, updateNotification, updateLocationPref }
}
