import { collection, addDoc, getDocs, query, orderBy } 
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { db } from "./firebaseConfig.js";

const kwInput = document.getElementById("kw");
const fechaInput = document.getElementById("fecha");
const horaInput = document.getElementById("hora");
const tempInput = document.getElementById("temp");
const tablaBody = document.querySelector("#tabla tbody");

const campoOrdenSelect = document.getElementById("campoOrden");
const direccionOrdenSelect = document.getElementById("direccionOrden");

// Guardar consumo
document.getElementById("btnGuardar").addEventListener("click", async () => {
    if (!kwInput.value || !fechaInput.value || !horaInput.value || !tempInput.value) {
        alert("Completa todos los campos");
        return;
    }

    const fechaHora = new Date(`${fechaInput.value}T${horaInput.value}:00`);

    const data = {
        kw: Number(kwInput.value),
        fecha: fechaInput.value,
        hora: horaInput.value,
        temperatura: Number(tempInput.value),
        fechaHora: fechaHora
    };

    await addDoc(collection(db, "lecturas"), data);

    kwInput.value = "";
    fechaInput.value = "";
    horaInput.value = "";
    tempInput.value = "";

    cargarDatos();
});

// Cargar historial con doble filtro
async function cargarDatos() {
    tablaBody.innerHTML = "";

    const campo = campoOrdenSelect.value || "none";
    const direccion = direccionOrdenSelect.value || "none";

    let q;
    if(campo === "none" || direccion === "none") {
        // Orden por defecto: fechaHora descendente
        q = query(collection(db, "lecturas"), orderBy("fechaHora", "desc"));
    } else {
        q = query(collection(db, "lecturas"), orderBy(campo, direccion));
    }

    const snap = await getDocs(q);

    snap.forEach(doc => {
        const d = doc.data();
        tablaBody.innerHTML += `
            <tr>
                <td>${d.kw}</td>
                <td>${d.fecha}</td>
                <td>${d.hora}</td>
                <td>${d.temperatura}</td>
            </tr>
        `;
    });
}


// Listeners para los filtros
campoOrdenSelect.addEventListener("change", cargarDatos);
direccionOrdenSelect.addEventListener("change", cargarDatos);

// Carga inicial
cargarDatos();
