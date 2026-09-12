import { Router } from 'express'
import { firebaseService } from '../services/firebaseService.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

// GET /api/activity
router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const deviceId = req.query.deviceId || 'netra-helmet-01'
    const activities = await firebaseService.getRecentActivity(deviceId)
    res.json({ activities })
  })
)

export default router
