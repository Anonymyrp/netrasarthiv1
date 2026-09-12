import { verifyAccessToken } from '../utils/jwt.js'
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js'
import { config } from '../config/env.js'

export function authenticate(req, res, next) {
  // Check for Authorization header
  const authHeader = req.headers.authorization
  let token = null

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  } else if (req.query && req.query.token) {
    // Allows query param token for SSE EventSource streams
    token = req.query.token
  }

  if (!token) {
    return next(new UnauthorizedError('Access token is missing or invalid'))
  }

  try {
    const decoded = verifyAccessToken(token)
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token has expired. Please refresh your session.'))
    }
    return next(new UnauthorizedError('Invalid authentication token'))
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'))
    }

    if (!roles.includes(req.user.role) && !roles.includes('*')) {
      return next(new ForbiddenError(`Role '${req.user.role}' is not authorized to access this resource`))
    }

    next()
  }
}

export function authenticateDevice(req, res, next) {
  const deviceKey = req.headers['x-device-key']

  // If valid device API key provided
  if (deviceKey && deviceKey === config.device.apiKey) {
    req.isDevice = true
    req.deviceId = req.body?.deviceId || 'netra-helmet-01'
    return next()
  }

  // Fallback: check if standard user/admin JWT was passed
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = verifyAccessToken(authHeader.split(' ')[1])
      if (['admin', 'device'].includes(decoded.role)) {
        req.user = decoded
        return next()
      }
    } catch {
      // Fall through to unauthorized error
    }
  }

  return next(new UnauthorizedError('Invalid or missing X-Device-Key header'))
}
