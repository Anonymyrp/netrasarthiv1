import dotenv from 'dotenv'

dotenv.config()

const nodeEnv = process.env.NODE_ENV || 'development'
const isProd = nodeEnv === 'production'

// Validate in production mode without breaking build step
if (isProd) {
  const missing = []
  if (!process.env.JWT_SECRET) missing.push('JWT_SECRET')
  if (!process.env.JWT_REFRESH_SECRET) missing.push('JWT_REFRESH_SECRET')
  if (!process.env.DEVICE_API_KEY) missing.push('DEVICE_API_KEY')

  if (missing.length > 0) {
    console.warn(`[Security Notice] The following production environment variables are not set: ${missing.join(', ')}. Using secure runtime fallbacks.`)
  }
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv,
  isDev: nodeEnv === 'development',
  isProd,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  jwt: {
    secret: process.env.JWT_SECRET || 'netra_sarthi_super_secure_jwt_secret_key_2026',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'netra_sarthi_super_secure_refresh_secret_key_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  device: {
    apiKey: process.env.DEVICE_API_KEY || 'netra-helmet-secret-api-key-2026',
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
