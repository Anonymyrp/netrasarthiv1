import { AppError } from '../utils/errors.js'
import { config } from '../config/env.js'

export function errorHandler(err, req, res, next) {
  // Log error in development
  if (config.isDev) {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err)
  }

  // Handle known operational AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details || null,
      ...(config.isDev ? { stack: err.stack } : {}),
    })
  }

  // Uncaught / standard 500 error
  return res.status(500).json({
    success: false,
    message: config.isDev ? err.message : 'Internal server error occurred',
    ...(config.isDev ? { stack: err.stack } : {}),
  })
}
