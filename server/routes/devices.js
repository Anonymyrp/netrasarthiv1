import { Router } from 'express'
import { z } from 'zod'
import { firebaseService } from '../services/firebaseService.js'
import { authenticate, authenticateDevice } from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

const telemetrySchema = {
  body: z.object({
    deviceId: z.string().optional().default('netra-helmet-01'),
    battery: z.number().min(0).max(100).optional(),
    charging: z.boolean().optional(),
    networkStatus: z.string().optional(),
    gpsStatus: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    accuracy: z.number().optional(),
    speed: z.number().optional(),
    address: z.string().optional(),
  }),
}

// GET /api/devices/:id/status
router.get(
  '/:id/status',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const status = await firebaseService.getDeviceStatus(id)
    res.json(status)
  })
)

// POST /api/devices/telemetry (Microcontroller / Helmet Ingestion)
router.post(
  '/telemetry',
  authenticateDevice,
  validate(telemetrySchema),
  asyncHandler(async (req, res) => {
    const data = req.body
    const deviceId = data.deviceId || req.deviceId || 'netra-helmet-01'

    // Update device status
    const statusPayload = {
      connected: true,
      ...(data.battery !== undefined ? { battery: data.battery } : {}),
      ...(data.charging !== undefined ? { charging: data.charging } : {}),
      ...(data.networkStatus ? { networkStatus: data.networkStatus } : {}),
      ...(data.gpsStatus ? { gpsStatus: data.gpsStatus } : {}),
      ...(data.accuracy !== undefined ? { accuracy: data.accuracy } : {}),
      lastSync: 'Just now',
    }
    await firebaseService.updateDeviceStatus(deviceId, statusPayload)

    // Update live location if coordinates present
    if (data.latitude !== undefined && data.longitude !== undefined) {
      const locationPayload = {
        status: 'active',
        latitude: data.latitude,
        longitude: data.longitude,
        ...(data.accuracy !== undefined ? { accuracy: data.accuracy } : {}),
        ...(data.speed !== undefined ? { speed: data.speed } : {}),
        ...(data.battery !== undefined ? { battery: data.battery } : {}),
        ...(data.address ? { address: data.address } : {}),
        updatedAt: 'Just now',
      }
      await firebaseService.updateLiveLocation(locationPayload)

      // Append to location history
      await firebaseService.appendLocationHistory(deviceId, {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy || 10,
        address: data.address || `${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`,
      })
    }

    res.json({
      success: true,
      message: 'Telemetry received and processed',
      timestamp: Math.floor(Date.now() / 1000),
    })
  })
)

export default router
