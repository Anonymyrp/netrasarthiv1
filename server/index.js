import app from './app.js'
import { config } from './config/env.js'

const PORT = config.port

const server = app.listen(PORT, () => {
  console.log(`=========================================`)
  console.log(` Netra Sarthi Backend Server Running     `)
  console.log(` URL: http://localhost:${PORT}          `)
  console.log(` Environment: ${config.nodeEnv}        `)
  console.log(` Health Check: http://localhost:${PORT}/api/health `)
  console.log(`=========================================`)
})

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  server.close(() => {
    console.log('Server process terminated.')
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...')
  server.close(() => {
    console.log('Server process terminated.')
  })
})

export default server
