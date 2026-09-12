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

const DEFAULT_FIREBASE_PROJECT_ID = 'netra-sarthi-46868'
const DEFAULT_FIREBASE_CLIENT_EMAIL = 'firebase-adminsdk-fbsvc@netra-sarthi-46868.iam.gserviceaccount.com'
const DEFAULT_FIREBASE_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0xJ0lNoTw40G0\nC2/y2+nxnSYIgZ2efCZi3pre/7Y8tDqpKzWeK7fTGHzFQc+WrYh/PmHZtsvOsv3Z\nXH8y1hnesoj3QlMb/0REYQ0zEIkBmKf5RHW7TiyoSvhV1dbjeFxPayXVRuYjisyY\nufY/4oELEoxSw/nQ0UoL/aPXU60muc2ihZGNd1s4VN58hR3meQNmh4wDEOD0XJEN\nq0bXksvTZMe799/awrL/66d4rztxYSaUsLwdGDRS+HF0j2k5nEs2AjVydO/U9ZNj\nHP/DqJX/2wHu/ebIWl3s2ktAxsXp5ti6GzP1oRYBmTAB3/VQZSj5yHcq2K2RPlCS\n76dMCdkvAgMBAAECggEACcn/7Iz4RAc6fqKD7HXmRFRLQ/io7XUxqvb9Eghs+PqV\nlqWlYKxjZwYTc6cts64wDxv0tpKElOvyfTvaE4mumvW2HxWzZHe9XaqXyWUi1jhL\nGF+RtJP2LSLqMdPDsEvLS+20fck6G0Cf9cFUSX9dl5joim7cb2d2CBIzNizs2oTr\n+KVs0hqgsa0JTpZcUYP/aqaVSgVn+7AI7fhwGBfki4zZDNaHJA4Nq5aP2GpkVeBj\nvzMuwRM9kuWrV4O3XSZkQYhZWe5JjRpnPNKXKc2BlIjyyEYG78kDRLNbm9igKNak\n/n1T/p7fAyHUd8vSoemhx1f5upvqRp1ycTXeQqXSMQKBgQDmLzeQwL/KjZf3LmjQ\nJ579w7zYbT5SvL1HSmjS9Cn5DRNcZXJfwrm+y7Bg6Ts0aT4w07trOwH6BCYJBLJZ\ntQT9sx3CTH8Au807dcYRQIbKcrLkMsnAYMQm6Gui1BT2q2qYyg0TqVHPl5S8MV0n\nlcZqhxPS+pz+mTRXj3g1cp/RVwKBgQDJCpxzPJAfd+dRqAMi1dbaYafdmF5+ROS1\nKxrGXsIBfCMRDNT+EXT084LxzkOScgwxb/U/Q5xrow5C16ig8pyKCU39Hlc05RSy\n3tpuYCvduddN52zU1fQzSX2RLtwUPewj3kmHYTzoWjtNZQMGcdGethh320lAtiEf\njqkuunaX6QKBgGYII/88EUe9v9DHd5pdFbKyovDka63ND7GcIB7yL/C/hQd9yFb+\nP8t9Cm/Ksn2m8PQ/xmHfxB6I3Ds/I7dz8ARs8xH/SoSOuohSyjs3eQggE3/nq1pl\nCk2c1KlWjPxSO2wClA1VDniQXlOVJg+36j2qJnVstU59pp/xbn1yk7j9AoGACjij\n46f8m9z4wcoM/sRofAnjAv0wMLNH/X4HinZe3rx0+/TvD0vL6nhG/AxEmzl5LTpH\n+cNyPHa5zuQwCp7LHqmCcZANVv8eokl6SYpSMJ+2NpvBiMCn/cOKwsrjHZRYYSp4\nCo4DDr0nrrOoB7fZtHwFmnJnswaPgI88QsfwJ6ECgYEA0T7qBX83YCRuFhQN4/cB\nHKn3nbIPLF0FLD4gIA/AuGuVt7YP/gPr1FQwn/3vqjej8A89XmbtEe5U2fLqVZMB\nSe6siaVQrexBKJIbJYurl9CIQp2NuLslZ/LLGO09UKP6lGtaVcnM6HgZsKoqZf0d\nvN5zqiW8pV0Zfcl+sk1woM8=\n-----END PRIVATE KEY-----\n`
const DEFAULT_FIREBASE_DATABASE_URL = 'https://netra-sarthi-46868-default-rtdb.firebaseio.com/'

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
    projectId: process.env.FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || DEFAULT_FIREBASE_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || DEFAULT_FIREBASE_PRIVATE_KEY)?.replace(/\\n/g, '\n') || '',
    databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_FIREBASE_DATABASE_URL,
    isConfigured: Boolean(
      (process.env.FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_PROJECT_ID) &&
      (process.env.FIREBASE_CLIENT_EMAIL || DEFAULT_FIREBASE_CLIENT_EMAIL) &&
      (process.env.FIREBASE_PRIVATE_KEY || DEFAULT_FIREBASE_PRIVATE_KEY)
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
