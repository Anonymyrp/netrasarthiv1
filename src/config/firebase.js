import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

if (!firebaseConfig.apiKey && import.meta.env.DEV) {
  console.warn("[Firebase] Warning: VITE_FIREBASE_API_KEY is not defined in .env. Realtime client features may be restricted.");
}

// Initialize Firebase only once
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} else {
  app = getApps()[0];
  console.log("Using existing Firebase instance");
}

// Get database instance
const db = getDatabase(app);

export { db };