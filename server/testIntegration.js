import app from './app.js'

let server = null
const TEST_PORT = 5055
const BASE_URL = `http://localhost:${TEST_PORT}`

async function runTests() {
  console.log('\n--- Starting Netra Sarthi Backend Integration Test Suite ---\n')

  server = app.listen(TEST_PORT)
  let passCount = 0
  let failCount = 0

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`)
      passCount++
    } else {
      console.error(`❌ FAIL: ${message}`)
      failCount++
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/api/health`)
    const healthData = await healthRes.json()
    assert(healthRes.status === 200 && healthData.status === 'ok', 'GET /api/health returns 200 OK with status: ok')

    // 2. Auth: Register
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test_${Date.now()}@netrasarthi.com`,
        password: 'Password123',
        displayName: 'Test Caretaker',
        tagline: 'Always watching out',
      }),
    })
    const regData = await regRes.json()
    assert(regRes.status === 201 && regData.accessToken, 'POST /api/auth/register returns 201 with accessToken and user')

    // 3. Auth: Login
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'shreya@example.com',
        password: 'Password123',
      }),
    })
    const loginData = await loginRes.json()
    assert(loginRes.status === 200 && loginData.accessToken, 'POST /api/auth/login returns 200 with JWT tokens')

    const token = loginData.accessToken
    const refreshToken = loginData.refreshToken
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }

    // 4. Protected endpoint without token rejected
    const unauthRes = await fetch(`${BASE_URL}/api/auth/me`)
    assert(unauthRes.status === 401, 'GET /api/auth/me without token correctly rejected with 401 Unauthorized')

    // 5. Protected endpoint with token accepted
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, { headers: authHeaders })
    const meData = await meRes.json()
    assert(meRes.status === 200 && meData.user.email === 'shreya@example.com', 'GET /api/auth/me with Bearer token returns authenticated user profile')

    // 6. Token refresh
    const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    const refreshData = await refreshRes.json()
    assert(refreshRes.status === 200 && refreshData.accessToken, 'POST /api/auth/refresh returns new accessToken')

    // 7. Device Status
    const deviceRes = await fetch(`${BASE_URL}/api/devices/netra-helmet-01/status`, { headers: authHeaders })
    const deviceData = await deviceRes.json()
    assert(deviceRes.status === 200 && deviceData.connected !== undefined && deviceData.battery !== undefined, 'GET /api/devices/:id/status returns full device connectivity payload')

    // 8. Device Telemetry without key rejected
    const badTelemetryRes = await fetch(`${BASE_URL}/api/devices/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: 18.5204, longitude: 73.8567 }),
    })
    assert(badTelemetryRes.status === 401, 'POST /api/devices/telemetry without X-Device-Key returns 401')

    // 9. Device Telemetry with key accepted
    const goodTelemetryRes = await fetch(`${BASE_URL}/api/devices/telemetry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-Key': 'netra-helmet-secret-api-key-2026',
      },
      body: JSON.stringify({
        deviceId: 'netra-helmet-01',
        battery: 82,
        charging: false,
        latitude: 18.5230,
        longitude: 73.8580,
        accuracy: 8,
        speed: 1.5,
        address: 'FC Road, Deccan, Pune',
      }),
    })
    const telemetryData = await goodTelemetryRes.json()
    assert(goodTelemetryRes.status === 200 && telemetryData.success, 'POST /api/devices/telemetry with X-Device-Key updates status and live coordinates')

    // 10. Live Location reflects ingested coordinates
    const liveRes = await fetch(`${BASE_URL}/api/locations/live`, { headers: authHeaders })
    const liveData = await liveRes.json()
    assert(liveRes.status === 200 && liveData.latitude === 18.5230, 'GET /api/locations/live returns updated coordinates from telemetry')

    // 11. Location History
    const historyRes = await fetch(`${BASE_URL}/api/locations/history?period=all`, { headers: authHeaders })
    const historyData = await historyRes.json()
    assert(historyRes.status === 200 && Array.isArray(historyData.entries) && historyData.entries.length > 0, 'GET /api/locations/history returns historical entries')

    // 12. Recordings & Storage
    const recRes = await fetch(`${BASE_URL}/api/recordings`, { headers: authHeaders })
    const recData = await recRes.json()
    assert(recRes.status === 200 && Array.isArray(recData.recordings), 'GET /api/recordings returns video list matching UI structure')

    const storageRes = await fetch(`${BASE_URL}/api/recordings/storage`, { headers: authHeaders })
    const storageData = await storageRes.json()
    assert(storageRes.status === 200 && storageData.usedMb !== undefined && storageData.totalMb !== undefined, 'GET /api/recordings/storage returns storage metrics')

    // 13. Alerts
    const alertsRes = await fetch(`${BASE_URL}/api/alerts`, { headers: authHeaders })
    const alertsData = await alertsRes.json()
    assert(alertsRes.status === 200 && Array.isArray(alertsData.alerts), 'GET /api/alerts returns alerts list and unreadCount')

    const markReadRes = await fetch(`${BASE_URL}/api/alerts/1/read`, {
      method: 'PATCH',
      headers: authHeaders,
    })
    assert(markReadRes.status === 200, 'PATCH /api/alerts/:id/read marks alert as read')

    // 14. Activity & Places
    const actRes = await fetch(`${BASE_URL}/api/activity`, { headers: authHeaders })
    const actData = await actRes.json()
    assert(actRes.status === 200 && Array.isArray(actData.activities), 'GET /api/activity returns activity stream')

    const placesRes = await fetch(`${BASE_URL}/api/places`, { headers: authHeaders })
    const placesData = await placesRes.json()
    assert(placesRes.status === 200 && Array.isArray(placesData.places), 'GET /api/places returns saved locations')

    // 15. System Status
    const sysRes = await fetch(`${BASE_URL}/api/system/status`, { headers: authHeaders })
    const sysData = await sysRes.json()
    assert(sysRes.status === 200 && sysData.status === 'normal', 'GET /api/system/status returns system operational state')

    // 16. Settings GET and PUT
    const setRes = await fetch(`${BASE_URL}/api/settings`, { headers: authHeaders })
    const setData = await setRes.json()
    assert(setRes.status === 200 && setData.notifications !== undefined, 'GET /api/settings returns user notification preferences')

    const updateSetRes = await fetch(`${BASE_URL}/api/settings`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        notifications: { weeklySummary: true },
      }),
    })
    const updateSetData = await updateSetRes.json()
    assert(updateSetRes.status === 200 && updateSetData.settings.notifications.weeklySummary === true, 'PUT /api/settings successfully updates preferences')

  } catch (err) {
    console.error('Fatal test error:', err)
    failCount++
  } finally {
    if (server) {
      server.close()
    }
    console.log(`\n--- Test Results: ${passCount} Passed, ${failCount} Failed ---\n`)
    if (failCount > 0) {
      process.exit(1)
    }
  }
}

runTests()
