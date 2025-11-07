// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA_brEs-7ciCRvAxj_nDQoggD0KaQrtS-w",
  authDomain: "volados-c435c.firebaseapp.com",
  projectId: "volados-c435c",
  storageBucket: "volados-c435c.firebasestorage.app",
  messagingSenderId: "178927992679",
  appId: "1:178927992679:web:b16c9c88feda4871a0f9c2",
  measurementId: "G-LWHS9K6XY3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);
