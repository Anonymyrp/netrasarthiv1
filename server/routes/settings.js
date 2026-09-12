import { Router } from 'express'
import { firebaseService } from '../services/firebaseService.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

// GET /api/settings
router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const settings = await firebaseService.getSettings(req.user.uid)
    res.json(settings)
  })
)

// PUT /api/settings
router.put(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const updated = await firebaseService.updateSettings(req.user.uid, req.body)
    res.json({ success: true, settings: updated })
  })
)

export default router
