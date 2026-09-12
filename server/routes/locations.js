import { Router } from 'express'
import { firebaseService } from '../services/firebaseService.js'
import { sseService } from '../services/sseService.js'
import { authenticate, authenticateDevice } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

// GET /api/locations/live
router.get(
  '/live',
  authenticate,
  asyncHandler(async (req, res) => {
    const location = await firebaseService.getLiveLocation()
    res.json(location)
  })
)

// GET /api/locations/live/stream (Server-Sent Events)
router.get(
  '/live/stream',
  authenticate,
  asyncHandler(async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    // Send initial snapshot immediately
    const initialLocation = await firebaseService.getLiveLocation()
    res.write(`event: location_update\ndata: ${JSON.stringify(initialLocation)}\n\n`)

    // Register with SSE manager
    sseService.addClient(res)
  })
)

// GET /api/locations/history
router.get(
  '/history',
  authenticate,
  asyncHandler(async (req, res) => {
    const period = req.query.period || 'all'
    const deviceId = req.query.deviceId || 'netra-helmet-01'

    const entries = await firebaseService.getLocationHistory(deviceId, period)
    res.json({ entries })
  })
)

// GET /api/locations/stats
router.get(
  '/stats',
  authenticate,
  asyncHandler(async (req, res) => {
    const deviceId = req.query.deviceId || 'netra-helmet-01'
    const history = await firebaseService.getLocationHistory(deviceId, 'all')

    res.json({
      totalPoints: history.length,
      estimatedDistanceKm: Math.round(history.length * 1.8 * 10) / 10,
      activeStatus: 'active',
      lastUpdated: 'Just now',
    })
  })
)

// POST /api/locations/live (Manual or Device direct update)
router.post(
  '/live',
  authenticateDevice,
  asyncHandler(async (req, res) => {
    const updated = await firebaseService.updateLiveLocation(req.body)
    res.json({ success: true, location: updated })
  })
)

export default router
