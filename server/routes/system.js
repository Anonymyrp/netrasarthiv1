import { Router } from 'express'
import { store } from '../services/mockDataStore.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

// GET /api/system/status
router.get(
  '/status',
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(store.systemStatus)
  })
)

export default router
