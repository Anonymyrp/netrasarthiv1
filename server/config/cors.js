import { config } from './env.js'

export const corsOptions = {
  origin: (origin, callback) => {
    // In development or when origin is undefined (like curl, Postman, or mobile/IoT clients)
    if (!origin || config.isDev) {
      return callback(null, true)
    }

    const allowedOrigins = [
      config.clientUrl,
      'https://www.yourdomain.com',
      'http://localhost:5173',
    ].filter(Boolean)

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin === 'null'
    ) {
      callback(null, true)
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Key'],
}
