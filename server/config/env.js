import dotenv from 'dotenv'

dotenv.config()

const nodeEnv = process.env.NODE_ENV || 'development'
const isProd = nodeEnv === 'production'

// Strict validation in production mode
if (isProd) {
  const missing = []
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('default')) missing.push('JWT_SECRET')
  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.includes('default')) missing.push('JWT_REFRESH_SECRET')
  if (!process.env.DEVICE_API_KEY) missing.push('DEVICE_API_KEY')

  if (missing.length > 0) {
    throw new Error(`[Security Error] Production deployment halted. The following required secrets are missing or using insecure defaults: ${missing.join(', ')}. Please set them in your environment manager.`)
  }
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv,
  isDev: nodeEnv === 'development',
  isProd,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  jwt: {
    secret: process.env.JWT_SECRET || (isProd ? '' : 'netra_sarthi_dev_jwt_secret'),
    refreshSecret: process.env.JWT_REFRESH_SECRET || (isProd ? '' : 'netra_sarthi_dev_refresh_secret'),
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  device: {
    apiKey: process.env.DEVICE_API_KEY || (isProd ? '' : 'netra-helmet-secret-api-key-2026'),
  },

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    databaseURL: process.env.FIREBASE_DATABASE_URL || '',
    isConfigured: Boolean(
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ),
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    isConfigured: Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ),
  },
}
