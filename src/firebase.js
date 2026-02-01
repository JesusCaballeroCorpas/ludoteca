// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⬇️ AQUÍ PEGARÁS TU firebaseConfig
const firebaseConfig = {
  apiKey: "AIzaSyAsF7yMHYkWi4wPFxqJx9gxRWDZJHPDCc4",
  authDomain: "ludoteca-app-46deb.firebaseapp.com",
  projectId: "ludoteca-app-46deb",
  storageBucket: "ludoteca-app-46deb.firebasestorage.app",
  messagingSenderId: "894520458475",
  appId: "1:894520458475:web:b7794c769d1c51a41552ae"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
