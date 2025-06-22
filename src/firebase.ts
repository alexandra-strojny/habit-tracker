// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
// Import the functions you need from the SDKs you need

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBS3KrRTI5gEo3gIrc22UvABbBuf3TyVR0",
  authDomain: "habit-tracker-796f4.firebaseapp.com",
  projectId: "habit-tracker-796f4",
  storageBucket: "habit-tracker-796f4.firebasestorage.app",
  messagingSenderId: "268806909319",
  appId: "1:268806909319:web:2c081b6e6478fec5e47722"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: persistentLocalCache(),
});
export const auth = getAuth(app);

