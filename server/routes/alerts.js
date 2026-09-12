import { Router } from 'express'
import { firebaseService } from '../services/firebaseService.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

// GET /api/alerts
router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user.uid
    const alerts = await firebaseService.getAlerts(userId)
    const unreadCount = alerts.filter((a) => !a.read).length

    res.json({
      unreadCount,
      alerts,
    })
  })
)

// PATCH /api/alerts/:id/read
router.patch(
  '/:id/read',
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user.uid
    const { id } = req.params
    const updated = await firebaseService.markAlertRead(userId, id)
    res.json({ success: true, id: parseInt(id, 10), read: true, alert: updated })
  })
)

// POST /api/alerts/read-all
router.post(
  '/read-all',
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user.uid
    await firebaseService.markAllAlertsRead(userId)
    res.json({ success: true, unreadCount: 0 })
  })
)

export default router
