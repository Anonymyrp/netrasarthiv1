import { useState, useEffect, useCallback } from 'react'
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

// Live location hook with SSE stream
export function useLiveLocation() {
  const [location, setLocation] = useState(mockCurrentLocation)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let eventSource = null

    const fetchInitial = async () => {
      try {
        const { data } = await apiClient.get('/locations/live')
        setLocation(data)
      } catch (err) {
        console.warn('Using cached mock location:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchInitial()

    // Establish SSE stream
    try {
      const token = localStorage.getItem('ns_access_token')
      const baseUrl = apiClient.defaults.baseURL || 'http://localhost:5000/api'
      const streamUrl = `${baseUrl}/locations/live/stream${token ? `?token=${token}` : ''}`

      eventSource = new EventSource(streamUrl)
      eventSource.addEventListener('location_update', (e) => {
        try {
          const updated = JSON.parse(e.data)
          setLocation(updated)
        } catch (parseErr) {
          console.error('SSE parse error:', parseErr)
        }
      })

      eventSource.onerror = () => {
        // SSE connection dropped, close gracefully
        if (eventSource) eventSource.close()
      }
    } catch (sseErr) {
      console.warn('SSE not available:', sseErr.message)
    }

    return () => {
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

// Location history hook
export function useLocationHistory(period = 'all', deviceId = 'netra-helmet-01') {
  const [entries, setEntries] = useState(mockLocationHistory)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        const { data } = await apiClient.get(`/locations/history?period=${period}&deviceId=${deviceId}`)
        if (data.entries && data.entries.length > 0) {
          setEntries(data.entries)
        } else {
          setEntries(mockLocationHistory.filter((e) => period === 'all' || e.period === period))
        }
      } catch (err) {
        console.warn('Using fallback location history:', err.message)
        setEntries(mockLocationHistory.filter((e) => period === 'all' || e.period === period))
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
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
