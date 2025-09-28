// =============================
//  Inicializar Firebase
// =============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// =============================
//  Revisar parámetros guardados en localStorage
// =============================
const params = localStorage.getItem("parametrosGenerador");
if (params) {
  const { x0, a, c, m } = JSON.parse(params);
  document.getElementById("x0").value = x0;
  document.getElementById("a").value = a;
  document.getElementById("c").value = c;
  document.getElementById("m").value = m;
  localStorage.removeItem("parametrosGenerador");
}

// =============================
//  Evento formulario
// =============================
document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const x0 = Number(document.getElementById("x0").value);
  const a = Number(document.getElementById("a").value);
  const c = Number(document.getElementById("c").value);
  const m = Number(document.getElementById("m").value);

  // =============================
  //  Generador Congruencial Mixto
  // =============================
  let x = x0;
  const generados = [];
  const vistos = new Set();

  while (!vistos.has(x.toString())) {
    vistos.add(x.toString());
    let next = (a * x + c) % m;
    let uniforme = Number(next) / Number(m);

    generados.push({
      x: x.toString(),
      siguiente: next.toString(),
      uniforme: uniforme.toFixed(5)
    });

    x = next;
  }

  // =============================
  //  Renderizar tabla + aviso
  // =============================
  let tablaHTML = `
    <table border="1">
      <tr>
        <th>i</th>
        <th>x</th>
        <th>Xi+1</th>
        <th>#uniforme</th>
      </tr>
  `;

  generados.forEach((fila, index) => {
    tablaHTML += `
      <tr>
        <td>${index}</td>
        <td>${fila.x}</td>
        <td>${fila.siguiente}</td>
        <td>${fila.uniforme}</td>
      </tr>
    `;
  });

  tablaHTML += `</table>`;
  tablaHTML += `
    <p style="color:red; font-weight:bold; margin-top:10px;">
      ⚠️ La Secuencia se repite <br>  Se han generado ${generados.length} iteraciones.
    </p>
  `;

  document.getElementById("resultado").innerHTML = tablaHTML;

  // =============================
  //  Guardar en Firestore solo si no se repite
  // =============================
  try {
    const q = query(
      collection(db, "mixto"),
      where("x0", "==", x0.toString()),
      where("a", "==", a.toString()),
      where("c", "==", c.toString()),
      where("m", "==", m.toString())
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      await addDoc(collection(db, "mixto"), {
        x0: x0.toString(),
        a: a.toString(),
        c: c.toString(),
        m: m.toString(),
        cantidad: generados.length,
        fecha: new Date().toISOString()
      });
      console.log("Historial guardado en Firestore ✅");
    } else {
      console.log("Secuencia ya existe, no se guardó duplicada ❌");
    }
  } catch (e) {
    console.error("Error al guardar en Firestore: ", e);
  }
});
