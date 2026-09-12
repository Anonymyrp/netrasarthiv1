import { Router } from 'express'
import { cloudinaryService } from '../services/cloudinaryService.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

// GET /api/recordings (also accessible at /api/cloudinary/videos for backward compatibility)
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const recordings = await cloudinaryService.listRecordings()
    res.json({ recordings })
  })
)

// GET /api/recordings/storage
router.get(
  '/storage',
  asyncHandler(async (req, res) => {
    const stats = await cloudinaryService.getStorageStats()
    res.json(stats)
  })
)

// DELETE /api/recordings/:id (Authorized: Admin role)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const result = await cloudinaryService.deleteRecording(req.params.id)
    res.json(result)
  })
)

export default router
