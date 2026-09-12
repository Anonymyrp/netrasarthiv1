import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { store } from '../services/mockDataStore.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { UnauthorizedError, ValidationError, NotFoundError } from '../utils/errors.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

// Zod schemas
const registerSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    displayName: z.string().min(2),
    tagline: z.string().optional().default('Care creates freedom'),
  }),
}

const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
}

const refreshSchema = {
  body: z.object({
    refreshToken: z.string().min(1),
  }),
}

const changePasswordSchema = {
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
  }),
}

// POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { email, password, displayName, tagline } = req.body

    const existingUser = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      throw new ValidationError('An account with this email already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = {
      uid: `usr_${Date.now()}`,
      email,
      passwordHash,
      name: displayName,
      tagline: tagline || 'Care creates freedom',
      role: 'user',
      createdAt: new Date().toISOString(),
    }

    store.users.push(newUser)

    const payload = { uid: newUser.uid, email: newUser.email, role: newUser.role, name: newUser.name }
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    store.activeRefreshTokens.add(refreshToken)

    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        uid: newUser.uid,
        name: newUser.name,
        email: newUser.email,
        tagline: newUser.tagline,
        role: newUser.role,
      },
    })
  })
)

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      throw new UnauthorizedError('Invalid email or password')
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password')
    }

    const payload = { uid: user.uid, email: user.email, role: user.role, name: user.name }
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    store.activeRefreshTokens.add(refreshToken)

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        tagline: user.tagline,
        role: user.role,
      },
    })
  })
)

// POST /api/auth/refresh
router.post(
  '/refresh',
  validate(refreshSchema),
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body

    if (!store.activeRefreshTokens.has(refreshToken)) {
      throw new UnauthorizedError('Refresh token is invalid or revoked')
    }

    try {
      const decoded = verifyRefreshToken(refreshToken)
      const user = store.users.find((u) => u.uid === decoded.uid)
      if (!user) {
        throw new UnauthorizedError('User account not found')
      }

      const payload = { uid: user.uid, email: user.email, role: user.role, name: user.name }
      const newAccessToken = signAccessToken(payload)

      res.json({
        success: true,
        accessToken: newAccessToken,
      })
    } catch {
      store.activeRefreshTokens.delete(refreshToken)
      throw new UnauthorizedError('Refresh token has expired or is invalid')
    }
  })
)

// GET /api/auth/me
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = store.users.find((u) => u.uid === req.user.uid) || {
      uid: req.user.uid,
      name: req.user.name || 'Shreya',
      email: req.user.email,
      tagline: 'Care creates freedom',
      role: req.user.role || 'user',
    }

    res.json({
      user: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        tagline: user.tagline,
        role: user.role,
      },
    })
  })
)

// POST /api/auth/logout
router.post(
  '/logout',
  authenticate,
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body || {}
    if (refreshToken) {
      store.activeRefreshTokens.delete(refreshToken)
    }
    res.json({ success: true, message: 'Logged out successfully' })
  })
)

// POST /api/auth/change-password
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body
    const user = store.users.find((u) => u.uid === req.user.uid)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isMatch) {
      throw new UnauthorizedError('Current password does not match')
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10)
    res.json({ success: true, message: 'Password updated successfully' })
  })
)

// POST /api/auth/logout-all
router.post(
  '/logout-all',
  authenticate,
  asyncHandler(async (req, res) => {
    store.activeRefreshTokens.clear()
    res.json({ success: true, message: 'Logged out from all devices' })
  })
)

export default router
