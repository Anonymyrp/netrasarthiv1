import { Router } from 'express'
import { z } from 'zod'
import { firebaseService } from '../services/firebaseService.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

const placeSchema = {
  body: z.object({
    name: z.string().min(1),
    type: z.string().optional().default('custom'),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
  }),
}

// GET /api/places
router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user.uid
    const places = await firebaseService.getFrequentPlaces(userId)
    res.json({ places })
  })
)

// POST /api/places
router.post(
  '/',
  authenticate,
  validate(placeSchema),
  asyncHandler(async (req, res) => {
    const userId = req.user.uid
    const newPlace = await firebaseService.addFrequentPlace(userId, req.body)
    res.status(201).json({ success: true, place: newPlace })
  })
)

export default router
