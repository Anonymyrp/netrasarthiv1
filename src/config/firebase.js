import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAl4AIJlUFOApyYOxdZNHnL-6d64NDsi5c",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "netra-sarthi-46868.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://netra-sarthi-46868-default-rtdb.firebaseio.com/",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "netra-sarthi-46868",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "netra-sarthi-46868.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "479551899312617",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:479551899312617:web:netra-sarthi",
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

// Get database instance with explicit database URL
const db = getDatabase(app, firebaseConfig.databaseURL);

export { db };