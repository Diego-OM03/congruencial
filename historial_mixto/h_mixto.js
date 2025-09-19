import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMbo-0nF7W1qY_zRXuxnSUFmO4t-Out6k",
  authDomain: "congruencial-mixto.firebaseapp.com",
  projectId: "congruencial-mixto",
  storageBucket: "congruencial-mixto.appspot.com",
  messagingSenderId: "933131138257",
  appId: "1:933131138257:web:55178ef4f431df5d5a41f0",
  measurementId: "G-3GVTTC929X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cargarHistorial() {
  const querySnapshot = await getDocs(collection(db, "mixto"));
  const tbody = document.querySelector("#tablaHistorial tbody");

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${data.x0}</td>
      <td>${data.a}</td>
      <td>${data.c}</td>
      <td>${data.m}</td>
      <td>${data.cantidad}</td>
      <td><button class="usar-btn">🔄 Usar</button></td>
    `;

    // 📌 Evento click en el botón
    fila.querySelector(".usar-btn").addEventListener("click", () => {
      localStorage.setItem("parametrosGenerador", JSON.stringify({
        x0: data.x0,
        a: data.a,
        c: data.c,
        m: data.m
      }));
      window.location.href = "../mixto/mixto.html"; // Redirigir al generador
    });

    tbody.appendChild(fila);
  });
}

cargarHistorial();
