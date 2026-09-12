import { config } from './env.js'

let firebaseAdmin = null
let db = null

if (config.firebase.isConfigured) {
  try {
    const { initializeApp, cert } = await import('firebase-admin/app')
    const { getDatabase } = await import('firebase-admin/database')
    firebaseAdmin = initializeApp({
      credential: cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
      }),
      databaseURL: config.firebase.databaseURL,
    })
    db = getDatabase(firebaseAdmin)
    console.log('[Firebase] Admin SDK initialized successfully.')
  } catch (err) {
    console.warn('[Firebase] Failed to initialize Firebase Admin SDK. Falling back to local mock store:', err.message)
  }
} else if (config.firebase.databaseURL) {
  console.log(`[Firebase] Connecting to Realtime Database at ${config.firebase.databaseURL} via REST adapter.`)
} else {
  console.log('[Firebase] No Firebase credentials provided in environment. Running in development mock mode.')
}

export { firebaseAdmin, db }
