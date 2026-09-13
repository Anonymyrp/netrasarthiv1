import { useState, useEffect, useCallback } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '../config/firebase'
import apiClient from '../api/client'
import {
  mockCurrentLocation,
  mockDeviceStatus,
  mockLocationHistory,
  mockRecordings,
  mockStorageStats,
  mockAlerts,
  mockRecentActivity,
  mockFrequentPlaces,
  mockSystemStatus,
} from '../data/mockDashboardData'

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

// Device connectivity hook
export function useDeviceStatus(deviceId = 'netra-helmet-01') {
  const [status, setStatus] = useState(mockDeviceStatus)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await apiClient.get(`/devices/${deviceId}/status`)
      setStatus(data)
    } catch (err) {
      console.warn('Using fallback device status:', err.message)
    } finally {
      setLoading(false)
    }
  }, [deviceId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { status, loading, refetch }
}

// Location history hook with Firebase RTDB + API fallback
export function useLocationHistory(period = 'all', deviceId = 'netra-helmet-01') {
  const [entries, setEntries] = useState(mockLocationHistory)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isSubscribed = true

    const historyRef = ref(db, 'location_history')
    const unsubscribe = onValue(
      historyRef,
      (snapshot) => {
        if (!isSubscribed) return
        const val = snapshot.val()
        if (val) {
          const devVal = val[deviceId] || val.device1 || val
          const raw = []
          for (const [k, v] of Object.entries(devVal)) {
            if (v && typeof v === 'object') {
              const lat = Number(v.latitude ?? v.lat)
              const lng = Number(v.longitude ?? v.lng ?? v.lon)
              if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                raw.push({ id: k, ...v, latitude: lat, longitude: lng, rawTime: Number(v.timestamp || k) || 0 })
              }
            }
          }

          if (raw.length > 0) {
            raw.sort((a, b) => (b.rawTime || 0) - (a.rawTime || 0))
            const newest = raw[0].rawTime > 1e11 ? raw[0].rawTime : raw[0].rawTime * 1000
            const ONE_DAY = 24 * 3600 * 1000
            const ONE_WEEK = 7 * ONE_DAY

            const mapped = raw.map((item, idx) => {
              const ms = item.rawTime ? (item.rawTime > 1e11 ? item.rawTime : item.rawTime * 1000) : Date.now()
              const diff = newest - ms
              let itemPeriod = 'all'
              if (diff <= ONE_DAY * 2) itemPeriod = 'today'
              else if (diff <= ONE_WEEK) itemPeriod = 'week'

              return {
                id: item.id || `loc_${idx + 1}`,
                latitude: item.latitude,
                longitude: item.longitude,
                accuracy: Number(item.accuracy || 8),
                address: item.address || `GPS Track (${item.latitude.toFixed(4)}° N, ${item.longitude.toFixed(4)}° E)`,
                timestamp: new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                rawTimestamp: ms,
                period: itemPeriod,
              }
            })

            const filtered = mapped.filter((e) => period === 'all' || e.period === period)
            setEntries(filtered.length > 0 ? filtered : mapped.slice(0, 30))
            setLoading(false)
            return
          }
        }
        fallbackFetch()
      },
      () => fallbackFetch()
    )

    const fallbackFetch = async () => {
      try {
        const { data } = await apiClient.get(`/locations/history?period=${period}&deviceId=${deviceId}`)
        if (isSubscribed && data?.entries?.length > 0) {
          setEntries(data.entries)
          setLoading(false)
          return
        }
      } catch (err) {
        console.warn('Using fallback location history:', err.message)
      }
      if (isSubscribed) {
        setEntries(mockLocationHistory.filter((e) => period === 'all' || e.period === period))
        setLoading(false)
      }
    }

    return () => {
      isSubscribed = false
      unsubscribe()
    }
  }, [period, deviceId])

  return { entries, loading }
}

// Recordings & storage hook
export function useRecordings() {
  const [recordings, setRecordings] = useState(mockRecordings)
  const [storageStats, setStorageStats] = useState(mockStorageStats)
  const [loading, setLoading] = useState(true)

  const fetchRecordingsData = useCallback(async () => {
    setLoading(true)
    try {
      const [recRes, storRes] = await Promise.all([
        apiClient.get('/recordings').catch(() => ({ data: { recordings: mockRecordings } })),
        apiClient.get('/recordings/storage').catch(() => ({ data: mockStorageStats })),
      ])
      setRecordings(recRes.data.recordings || mockRecordings)
      setStorageStats(storRes.data || mockStorageStats)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecordingsData()
  }, [fetchRecordingsData])

  const deleteRecording = async (id) => {
    await apiClient.delete(`/recordings/${id}`).catch(() => {})
    setRecordings((prev) => prev.filter((r) => r.id !== id))
  }

  return { recordings, storageStats, loading, refetch: fetchRecordingsData, deleteRecording }
}

// Alerts hook
export function useAlerts() {
  const [alerts, setAlerts] = useState(mockAlerts)
  const [loading, setLoading] = useState(true)

  const fetchAlerts = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/alerts')
      setAlerts(data.alerts || mockAlerts)
    } catch (err) {
      console.warn('Using fallback alerts:', err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  const markRead = async (id) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)))
    await apiClient.patch(`/alerts/${id}/read`).catch(() => {})
  }

  const markAllRead = async () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))
    await apiClient.post('/alerts/read-all').catch(() => {})
  }

  const unreadCount = alerts.filter((a) => !a.read).length

  return { alerts, unreadCount, loading, markRead, markAllRead, refetch: fetchAlerts }
}

// Recent activity hook
export function useRecentActivity() {
  const [activities, setActivities] = useState(mockRecentActivity)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await apiClient.get('/activity')
        setActivities(data.activities || mockRecentActivity)
      } catch (err) {
        console.warn('Using fallback activity:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  return { activities, loading }
}

// Frequent places hook
export function useFrequentPlaces() {
  const [places, setPlaces] = useState(mockFrequentPlaces)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const { data } = await apiClient.get('/places')
        setPlaces(data.places || mockFrequentPlaces)
      } catch (err) {
        console.warn('Using fallback places:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaces()
  }, [])

  const addPlace = async (place) => {
    try {
      const { data } = await apiClient.post('/places', place)
      setPlaces((prev) => [...prev, data.place])
      return data.place
    } catch (err) {
      const fallbackPlace = { id: Date.now(), ...place, lastVisited: 'Just now' }
      setPlaces((prev) => [...prev, fallbackPlace])
      return fallbackPlace
    }
  }

  return { places, loading, addPlace }
}

// System status hook
export function useSystemStatus() {
  const [systemStatus, setSystemStatus] = useState(mockSystemStatus)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await apiClient.get('/system/status')
        setSystemStatus(data)
      } catch (err) {
        console.warn('Using fallback system status:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [])

  return { systemStatus, loading }
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
