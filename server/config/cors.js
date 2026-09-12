import { config } from './env.js'

export const corsOptions = {
  origin: (origin, callback) => {
    // In development or when origin is undefined (like curl, Postman, or mobile/IoT clients)
    if (!origin || config.isDev) {
      return callback(null, true)
    }

    const allowedOrigins = [
      config.clientUrl, // resolves to https://yourdomain.com via CLIENT_URL env var
      'https://www.yourdomain.com',
      'http://localhost:5173',
    ]

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Key'],
}
