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

// Mount API routes
app.use('/api/health', healthRouter)
app.use('/api/test', healthRouter) // Backward compatibility alias
app.use('/api/auth', authRouter)
app.use('/api/devices', devicesRouter)
app.use('/api/locations', locationsRouter)
app.use('/api/recordings', recordingsRouter)
app.use('/api/cloudinary/videos', recordingsRouter) // Backward compatibility alias
app.use('/api/alerts', alertsRouter)
app.use('/api/activity', activityRouter)
app.use('/api/places', placesRouter)
app.use('/api/system', systemRouter)
app.use('/api/settings', settingsRouter)

// 404 handler for undefined routes
app.use((req, res, next) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`))
})

// Centralized error handler
app.use(errorHandler)

export default app
