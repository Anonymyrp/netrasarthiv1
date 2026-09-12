import { config } from './env.js'

let cloudinary = null

if (config.cloudinary.isConfigured) {
  try {
    const v2 = await import('cloudinary')
    v2.v2.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
    })
    cloudinary = v2.v2
    console.log('[Cloudinary] SDK configured successfully.')
  } catch (err) {
    console.warn('[Cloudinary] Failed to configure Cloudinary SDK. Running in mock mode:', err.message)
  }
} else {
  console.log('[Cloudinary] No Cloudinary credentials provided in environment. Running in development mock mode.')
}

export { cloudinary }
