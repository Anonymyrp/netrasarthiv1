import { Router } from 'express'
import { config } from '../config/env.js'

const router = Router()

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Netra Sarthi Backend API',
    version: '1.0.0',
    mode: config.nodeEnv,
    integrations: {
      firebase: config.firebase.isConfigured ? 'live' : 'mock-fallback',
      cloudinary: config.cloudinary.isConfigured ? 'live' : 'mock-fallback',
    },
    timestamp: Math.floor(Date.now() / 1000),
  })
})

export default router
