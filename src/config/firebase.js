import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAl4AIJlUFOApyYOxdZNHnL-6d64NDsi5c",
  authDomain: "netra-sarthi-46868.firebaseapp.com",
  databaseURL: "https://netra-sarthi-46868-default-rtdb.firebaseio.com/",
  projectId: "netra-sarthi-46868",
  storageBucket: "netra-sarthi-46868.appspot.com",
  messagingSenderId: "479551899312617", // Your API key is the sender ID
  appId: "1:479551899312617:web:your-app-id" // You can get this from Firebase Console
};

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