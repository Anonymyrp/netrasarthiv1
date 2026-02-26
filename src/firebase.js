import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAl4AIJlUFOApyYOxdZNHnL-6d64NDsi5c",
  authDomain: "netra-sarthi-46868.firebaseapp.com",
  databaseURL: "https://netra-sarthi-46868-default-rtdb.firebaseio.com/",
  projectId: "netra-sarthi-46868",
  storageBucket: "netra-sarthi-46868.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);