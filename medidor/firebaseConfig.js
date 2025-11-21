import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj6xUHD2zKZfWx89-wzelNlXvelzFOwPc",
  authDomain: "medidor-4d856.firebaseapp.com",
  projectId: "medidor-4d856",
  storageBucket: "medidor-4d856.firebasestorage.app",
  messagingSenderId: "963111710880",
  appId: "1:963111710880:web:8eefe1141f6e82294199c5",
  measurementId: "G-LJF860X7YR"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log("Firebase cargado.");
