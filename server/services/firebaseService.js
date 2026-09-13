import { db } from '../config/firebase.js'
import { config } from '../config/env.js'
import { store } from './mockDataStore.js'
import { sseService } from './sseService.js'

const rtdbBase = config.firebase.databaseURL ? config.firebase.databaseURL.replace(/\/+$/, '') : null

async function rtdbGet(path) {
  if (db) {
    const snap = await db.ref(path).once('value')
    return snap.val()
  }
  if (rtdbBase) {
    try {
      const res = await fetch(`${rtdbBase}/${path}.json`)
      if (res.ok) {
        return await res.json()
      }
    } catch (err) {
      console.warn(`[Firebase RTDB] Error reading ${path}:`, err.message)
    }
  }
  return null
}

async function rtdbSet(path, data) {
  if (db) {
    await db.ref(path).set(data)
    return
  }
  if (rtdbBase) {
    try {
      await fetch(`${rtdbBase}/${path}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (err) {
      console.warn(`[Firebase RTDB] Error writing ${path}:`, err.message)
    }
  }
}

export const firebaseService = {
  // Live location
  async getLiveLocation() {
    const live = await rtdbGet('live_location')
    if (live) {
      const dev = live.device1 || live['netra-helmet-01'] || live['netra_sarthi_01'] || {}
      const lat = dev.latitude !== undefined ? Number(dev.latitude) : (live.latitude !== undefined ? Number(live.latitude) : store.currentLocation.latitude)
      const lng = dev.longitude !== undefined ? Number(dev.longitude) : (live.longitude !== undefined ? Number(live.longitude) : store.currentLocation.longitude)

      let address = dev.address || live.address
      if (!address) {
        address = `Pune Route (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`
      }

      return {
        status: live.status || 'active',
        latitude: lat,
        longitude: lng,
        address,
        accuracy: dev.accuracy !== undefined ? Number(dev.accuracy) : (live.accuracy !== undefined ? Number(live.accuracy) : 10),
        updatedAt: live.updatedAt || 'Just now',
        speed: dev.speed !== undefined ? Number(dev.speed) : (live.speed !== undefined ? Number(live.speed) : 0),
        battery: dev.battery !== undefined ? Number(dev.battery) : (live.battery !== undefined ? Number(live.battery) : 85),
      }
    }
    return store.currentLocation
  },

  async updateLiveLocation(locationData) {
    store.currentLocation = {
      ...store.currentLocation,
      ...locationData,
      updatedAt: 'Just now',
    }

    await rtdbSet('live_location', store.currentLocation)

    // Broadcast update to all connected SSE clients
    sseService.broadcast('location_update', store.currentLocation)
    return store.currentLocation
  },

  // Device status
  async getDeviceStatus(deviceId) {
    const status = await rtdbGet(`device_status/${deviceId}`)
    if (status) {
      return status
    }
    return store.deviceStatus[deviceId] || store.deviceStatus['netra-helmet-01']
  },

  async updateDeviceStatus(deviceId, statusData) {
    const updated = {
      ...(store.deviceStatus[deviceId] || {}),
      ...statusData,
      deviceId,
      lastSync: 'Just now',
    }
    store.deviceStatus[deviceId] = updated

    await rtdbSet(`device_status/${deviceId}`, updated)
    return updated
  },

  // Location history
  async getLocationHistory(deviceId, period = 'all') {
    let val = await rtdbGet(`location_history/${deviceId}`)
    if (!val && (deviceId === 'netra-helmet-01' || !deviceId)) {
      val = await rtdbGet('location_history/device1')
    }
    if (!val) {
      const allDevices = await rtdbGet('location_history')
      if (allDevices && typeof allDevices === 'object') {
        const firstKey = Object.keys(allDevices)[0]
        if (firstKey) val = allDevices[firstKey]
      }
    }

    if (val) {
      const rawList = Array.isArray(val)
        ? val
        : Object.entries(val).map(([k, v]) => ({ id: k, ...v }))

      // Sort newest first
      rawList.sort((a, b) => {
        const ta = Number(a.timestamp) || 0
        const tb = Number(b.timestamp) || 0
        return tb - ta
      })

      // Get latest timestamp to calculate relative 'today' and 'week' periods
      const newestTime = rawList[0]?.timestamp
        ? (Number(rawList[0].timestamp) > 1e11 ? Number(rawList[0].timestamp) : Number(rawList[0].timestamp) * 1000)
        : Date.now()

      const ONE_DAY_MS = 24 * 60 * 60 * 1000
      const ONE_WEEK_MS = 7 * ONE_DAY_MS

      const mapped = rawList.map((entry, idx) => {
        const rawTime = Number(entry.timestamp)
        const ms = (rawTime && rawTime > 1e11) ? rawTime : (rawTime ? rawTime * 1000 : Date.now())
        const dateObj = new Date(ms)

        const timeDiffFromNewest = newestTime - ms
        let itemPeriod = 'all'
        if (timeDiffFromNewest <= ONE_DAY_MS * 2) {
          itemPeriod = 'today'
        } else if (timeDiffFromNewest <= ONE_WEEK_MS) {
          itemPeriod = 'week'
        }

        let address = entry.address
        if (!address) {
          const lat = Number(entry.latitude)
          const lng = Number(entry.longitude)
          if (!isNaN(lat) && !isNaN(lng)) {
            if (lat >= 18 && lat <= 19) {
              address = `Pune Route (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`
            } else if (lat >= 19.5 && lat <= 20.5) {
              address = `Nashik Route (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`
            } else {
              address = `GPS Track (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`
            }
          } else {
            address = 'Saved GPS Coordinate'
          }
        }

        return {
          id: entry.id || `loc_${idx + 1}`,
          latitude: Number(entry.latitude),
          longitude: Number(entry.longitude),
          accuracy: Number(entry.accuracy || 8),
          address,
          timestamp: dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          period: itemPeriod,
          rawTimestamp: ms,
        }
      })

      let filtered = mapped
      if (period === 'today') {
        filtered = mapped.filter((e) => e.period === 'today')
        if (filtered.length === 0) filtered = mapped.slice(0, 25)
      } else if (period === 'week') {
        filtered = mapped.filter((e) => e.period === 'today' || e.period === 'week')
        if (filtered.length === 0) filtered = mapped.slice(0, 60)
      } else {
        // 'all': return up to 150 points for smooth map rendering
        filtered = mapped.slice(0, 150)
      }

      return filtered
    }

    return store.locationHistory.filter((entry) => period === 'all' || entry.period === period)
  },

  async appendLocationHistory(deviceId, entry) {
    const newEntry = {
      id: store.locationHistory.length + 1,
      ...entry,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      period: 'today',
    }

    store.locationHistory.unshift(newEntry)

    if (db) {
      await db.ref(`location_history/${deviceId}`).push(newEntry)
    }

    return newEntry
  },

  // Frequent places
  async getFrequentPlaces(userId) {
    if (db) {
      const snap = await db.ref(`frequent_places/${userId}`).once('value')
      const val = snap.val()
      if (val) {
        return Array.isArray(val) ? val : Object.values(val)
      }
    }
    return store.frequentPlaces
  },

  async addFrequentPlace(userId, place) {
    const newPlace = {
      id: store.frequentPlaces.length + 1,
      ...place,
      lastVisited: 'Just now',
    }
    store.frequentPlaces.push(newPlace)

    if (db) {
      await db.ref(`frequent_places/${userId}`).push(newPlace)
    }

    return newPlace
  },

  // Recent activity
  async getRecentActivity(deviceId) {
    if (db) {
      const snap = await db.ref(`activity/${deviceId}`).once('value')
      const val = snap.val()
      if (val) {
        return Array.isArray(val) ? val : Object.values(val)
      }
    }
    return store.recentActivity
  },

  // Alerts
  async getAlerts(userId) {
    if (db) {
      const snap = await db.ref(`alerts/${userId}`).once('value')
      const val = snap.val()
      if (val) {
        return Array.isArray(val) ? val : Object.values(val)
      }
    }
    return store.alerts
  },

  async markAlertRead(userId, alertId) {
    const id = parseInt(alertId, 10)
    const alert = store.alerts.find((a) => a.id === id)
    if (alert) {
      alert.read = true
    }

    if (db) {
      await db.ref(`alerts/${userId}/${alertId}/read`).set(true)
    }

    return alert
  },

  async markAllAlertsRead(userId) {
    for (const a of store.alerts) {
      a.read = true
    }

    if (db) {
      await db.ref(`alerts/${userId}`).transaction((current) => {
        if (!current) return current
        Object.keys(current).forEach((key) => {
          current[key].read = true
        })
        return current
      })
    }

    return store.alerts
  },

  // Settings
  async getSettings(userId) {
    return store.settings
  },

  async updateSettings(userId, newSettings) {
    store.settings = {
      ...store.settings,
      ...newSettings,
      notifications: {
        ...store.settings.notifications,
        ...(newSettings.notifications || {}),
      },
      locationPrefs: {
        ...store.settings.locationPrefs,
        ...(newSettings.locationPrefs || {}),
      },
    }
    return store.settings
  },
}
