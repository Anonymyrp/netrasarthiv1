import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { corsOptions } from './config/cors.js'
import { standardLimiter } from './middleware/rateLimiter.js'
import { errorHandler } from './middleware/errorHandler.js'
import { NotFoundError } from './utils/errors.js'

// Routes
import healthRouter from './routes/health.js'
import authRouter from './routes/auth.js'
import devicesRouter from './routes/devices.js'
import locationsRouter from './routes/locations.js'
import recordingsRouter from './routes/recordings.js'
import alertsRouter from './routes/alerts.js'
import activityRouter from './routes/activity.js'
import placesRouter from './routes/places.js'
import systemRouter from './routes/system.js'
import settingsRouter from './routes/settings.js'
import { config } from './config/env.js'

const app = express()

// Trust reverse proxy (Cloudflare / Vercel)
if (!config.isDev) {
  app.set('trust proxy', 1)
}


// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)

// CORS
app.use(cors(corsOptions))

// Request logging
app.use(morgan('dev'))

// Body parsers
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting for API endpoints
app.use('/api', standardLimiter)

// Base API status / discovery endpoint
app.get(['/', '/api'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'Netra Sarthi Backend API',
    version: '1.0.0',
    mode: config.nodeEnv,
    integrations: {
      firebase: config.firebase.isConfigured ? 'live' : 'mock',
      cloudinary: config.cloudinary.isConfigured ? 'live' : 'mock',
    },
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      devices: '/api/devices',
      locations: '/api/locations',
      alerts: '/api/alerts',
      settings: '/api/settings',
      recordings: '/api/recordings',
    },
    timestamp: Math.floor(Date.now() / 1000),
  })
})

// Mount API routes (supports both /api and direct serverless invocation)
const mountRoutes = (prefix = '') => {
  app.use(`${prefix}/health`, healthRouter)
  app.use(`${prefix}/test`, healthRouter)
  app.use(`${prefix}/auth`, authRouter)
  app.use(`${prefix}/devices`, devicesRouter)
  app.use(`${prefix}/locations`, locationsRouter)
  app.use(`${prefix}/recordings`, recordingsRouter)
  app.use(`${prefix}/cloudinary/videos`, recordingsRouter)
  app.use(`${prefix}/alerts`, alertsRouter)
  app.use(`${prefix}/activity`, activityRouter)
  app.use(`${prefix}/places`, placesRouter)
  app.use(`${prefix}/system`, systemRouter)
  app.use(`${prefix}/settings`, settingsRouter)
}

mountRoutes('/api')
mountRoutes('')

// 404 handler for undefined routes
app.use((req, res, next) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`))
})

// Centralized error handler
app.use(errorHandler)

export default app
