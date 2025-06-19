// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBS3KrRTI5gEo3gIrc22UvABbBuf3TyVR0",
  authDomain: "habit-tracker-796f4.firebaseapp.com",
  projectId: "habit-tracker-796f4",
  storageBucket: "habit-tracker-796f4.firebasestorage.app",
  messagingSenderId: "268806909319",
  appId: "1:268806909319:web:2c081b6e6478fec5e47722"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

