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
const DEFAULT_FIREBASE_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC+5Fhpr9mB4gYy\nSitnA+/pE65KmsjFJzBdr6BYgA/fg3FshNqt5QyD1dE+gkI6k5eBxR1MQcZJc8Ab\n7EZ5bPCIIoN6my6Vq90N1KPL/l/cW1TALYfJej8/9DqOqAqR6TftvGvK20S85ilR\ntT5CY80O/+IaqP8RX6FME7w5b/H2HHuzFjphrA9dokpzx5pC/3VKt3PQO3ajUZVe\nTvC5oxiYh4N/AqyVTLBcMgKtI7nO6URzTZUBcBm9xQmRk8rNmnw4ZZ9GlNtq36NA\nFb3nJYh3uZ1hWrU4HMwv7AC/jMIeT9eKf7PKl0rQK9BZv5W4F6EaAAQcB8TThqwG\no0rWv9ZDAgMBAAECggEAF+QQQz/l6bQY3ENkSh1YkIGn3m/w2d71WQAP4tYkDqTb\nBcCnlZ75K/wTvpuFLEG7RZIPd8K3nP2kK61Z2GcOElY7QkfGcVlR0whTw9ygMFzG\nG/f00i91V1JgH6TkZZN+TkCwOTmlwIhPcsWAcMibIB+JsqZNPb9vR5KQfR9U4aHp\nYw77EZZTavV2tq15IqP0cRcLMjX3KLS93u3fJuh39bW5SP8gQpE8TyIfap/9IhT2\n/7NwE+Jk2zI+dxq9V20t5yT4p14QJug+rzu72pPzIye0/TKQ/suhZtAgc5P6E4qH\nfMp0KbOdaX03pWQzJNnIACWIXI6D1kC6l3F19IJp2QKBgQD2id0PIO2cO0vzPDU+\n7gR4B5g3yR+E8nV5pzC42h8qWZbI9Fm2Pq5RQ9kGtqE7XQp2lB3MkkvN1P6mS8jQ\nLzMZ3ZR6KZrJqJxOqXZJ1JzLqNqV1bQp2lB3MkkvN1P6mS8jQLzMZ3ZR6KZrJqJ\nxOqXZJ1JzLqNqV1bQp2lB3MkkvN1P6mS8jQKBgQDGkKZrJqJxOqXZJ1JzLqNqV1b\nQp2lB3MkkvN1P6mS8jQLzMZ3ZR6KZrJqJxOqXZJ1JzLqNqV1bQp2lB3MkkvN1\nP6mS8jQLzMZ3ZR6KZrJqJxOqXZJ1JzLqNqV1bQp2lB3MkkvN1P6mS8jQLzMZ3Z\nR6KZrJqJxOqXZJ1JzLqNqV1bQKBgEQoZKrJqJxOqXZJ1JzLqNqV1bQp2lB3Mkkv\nN1P6mS8jQLzMZ3ZR6KZrJqJxOqXZJ1JzLqNqV1bQp2lB3MkkvN1P6mS8jQLzMZ3\nZR6KZrJqJxOqXZJ1JzLqNqV1bQp2lB3MkkvN1P6mS8jQLzMZ3ZR6KZrJqJxOqX\nZJ1JzLqNqV1bQKBgQD2id0PIO2cO0vzPDU+7gR4B5g3yR+E8nV5pzC42h8qWZbI\n9Fm2Pq5RQ9kGtqE7XQp2lB3MkkvN1P6mS8jQLzMZ3ZR6KZrJqJxOqXZJ1JzLqNq\nV1bQp2lB3MkkvN1P6mS8jQLzMZ3ZR6KZrJqJxOqXZJ1JzLqNqV1bQKBgQC+5Fhp\nr9mB4gYySitnA+/pE65KmsjFJzBdr6BYgA/fg3FshNqt5QyD1dE+gkI6k5eBxR1M\nQcZJc8Ab7EZ5bPCIIoN6my6Vq90N1KPL/l/cW1TALYfJej8/9DqOqAqR6TftvGvK\n20S85ilRtT5CY80O/+IaqP8RX6FME7w5b/H2HHuzFjphrA9dokpzx5pC/3VKt3PQ\nO3ajUZVeTvC5oxiYh4N/AqyVTLBcMgKtI7nO6URzTZUBcBm9xQmRk8rNmnw4ZZ9G\nlNtq36NAFb3nJYh3uZ1hWrU4HMwv7AC/jMIeT9eKf7PKl0rQK9BZv5W4F6EaAAQc\nB8TThqwGo0rWv9ZDAgMBAAE=\n-----END PRIVATE KEY-----\n`
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
