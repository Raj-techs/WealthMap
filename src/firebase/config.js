// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABwkEshJmkFXhEcK48vovmHZEh56eB30A",
  authDomain: "wealth-map-b1f8a.firebaseapp.com",
  projectId: "wealth-map-b1f8a",
  storageBucket: "wealth-map-b1f8a.firebasestorage.app",
  messagingSenderId: "944300881397",
  appId: "1:944300881397:web:4690a814f01cd4c2091cbc",
  measurementId: "G-BNCFCGN2BX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
