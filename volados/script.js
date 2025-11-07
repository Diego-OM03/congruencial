import { db } from "./firebaseConfig.js";
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const pantallaInicial = document.getElementById("pantalla-inicial");
const juegoDiv = document.getElementById("juego");
const crearSalaBtn = document.getElementById("crear-sala");
const unirseSalaBtn = document.getElementById("unirse-sala");
const codigoGenerado = document.getElementById("codigo-generado");
const nombreInput = document.getElementById("nombre");
const codigoInput = document.getElementById("codigo-sala");

const saldoJugadorEl = document.getElementById("saldo-jugador");
const saldoRivalEl = document.getElementById("saldo-rival");
const apuestaEl = document.getElementById("apuesta");
const coin = document.getElementById("coin");
const resultEl = document.getElementById("result");
const historyEl = document.getElementById("history");
const choiceBtns = document.querySelectorAll(".choice");

const nombreJugadorEl = document.getElementById("nombre-jugador");
const nombreRivalEl = document.getElementById("nombre-rival");


let jugadorNombre, salaCodigo, jugadorKey;
let salaRef;

// =====================
// Crear sala
// =====================
crearSalaBtn.addEventListener("click", async () => {
  jugadorNombre = nombreInput.value.trim();
  if (!jugadorNombre) return alert("Ingresa tu nombre");

  salaCodigo = Math.random().toString(36).substring(2, 6).toUpperCase();
  jugadorKey = "jugador1";

  salaRef = doc(db, "salas", salaCodigo);
  await setDoc(salaRef, {
    jugador1: { nombre: jugadorNombre, saldo: 100 },
    jugador2: null,
    estado: "esperando",
    ultimoTiro: null
  });

  // Mostrar código ANTES de ocultar pantalla inicial
  codigoGenerado.innerHTML = `
    <p>✅ Sala creada. Esperando jugador...</p>
    <p><strong>Código de sala:</strong> <span id="code">${salaCodigo}</span></p>
    <button id="copiar-codigo">📋 Copiar código</button>
  `;

  // Evento de copiar
  const copiarBtn = document.getElementById("copiar-codigo");
  copiarBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(salaCodigo);
    copiarBtn.textContent = "✅ Copiado";
    setTimeout(() => copiarBtn.textContent = "📋 Copiar código", 1500);
  });

  // 🔥 Esperar 2 segundos para mostrar el código y luego pasar al juego
  setTimeout(() => {
    pantallaInicial.style.display = "none";
    juegoDiv.style.display = "block";
    escucharSala();
  }, 5000);
});



// =====================
// Unirse a sala
// =====================
unirseSalaBtn.addEventListener("click", async () => {
  jugadorNombre = nombreInput.value.trim();
  salaCodigo = codigoInput.value.trim().toUpperCase();
  if (!jugadorNombre || !salaCodigo) return alert("Nombre y código requeridos");

  jugadorKey = "jugador2";
  salaRef = doc(db, "salas", salaCodigo);
  const snap = await getDoc(salaRef);
  if (!snap.exists()) return alert("Sala no existe");

  const data = snap.data();
  if (data.jugador2) return alert("Sala ya está completa");

  await updateDoc(salaRef, {
    jugador2: { nombre: jugadorNombre, saldo: 100 },
    estado: "jugando"
  });

  pantallaInicial.style.display = "none";
  juegoDiv.style.display = "block";

  escucharSala();
});

// =====================
// Escuchar sala en tiempo real
// =====================
function escucharSala() {
  onSnapshot(salaRef, (snap) => {
    const data = snap.data();
    if (!data) return;

    // Mostrar nombres
    if (jugadorKey === "jugador1") {
      nombreJugadorEl.textContent = data.jugador1?.nombre || "-";
      nombreRivalEl.textContent = data.jugador2?.nombre || "Esperando...";
    } else {
      nombreJugadorEl.textContent = data.jugador2?.nombre || "-";
      nombreRivalEl.textContent = data.jugador1?.nombre || "Esperando...";
    }
    

    // Estado espera / jugando
    if (data.estado === "esperando") {
      resultEl.textContent = "🕓 Esperando a que se una el segundo jugador...";
    }
    if (data.estado === "jugando" && data.jugador1 && data.jugador2) {
      const rival = jugadorKey === "jugador1" ? data.jugador2.nombre : data.jugador1.nombre;
      resultEl.textContent = `🎮 ¡Listo! ${rival} se unió. Comiencen a jugar.`;
    }

    // Actualizar saldos
    if (jugadorKey === "jugador1") {
      saldoJugadorEl.textContent = data.jugador1.saldo;
      saldoRivalEl.textContent = data.jugador2 ? data.jugador2.saldo : 0;
    } else {
      saldoJugadorEl.textContent = data.jugador2.saldo;
      saldoRivalEl.textContent = data.jugador1.saldo;
    }

    // Último tiro
    if (data.ultimoTiro) {
      const lt = data.ultimoTiro;
      resultEl.textContent = `🎲 ${lt.ganadorNombre} ganó la ronda (${lt.resultado.toUpperCase()})`;
      // 🔁 Hacer que siempre gire (aún si sale igual)
      coin.style.transition = "transform 1s ease-in-out";
      coin.style.transform = `rotateY(${Math.random() * 3600 + 1080}deg)`;
      setTimeout(() => {
        coin.style.transform = lt.resultado === "cara" ? "rotateY(0deg)" : "rotateY(180deg)";
      }, 1000);
      
      const li = document.createElement("li");
      li.textContent = `${lt.ganadorNombre} ganó $${lt.apuesta} → Resultado: ${lt.resultado}`;
      historyEl.prepend(li);
    }
  });
}

// =====================
// Jugar ronda
// =====================
choiceBtns.forEach(btn => btn.addEventListener("click", async () => {
  const eleccion = btn.dataset.choice;
  const apuesta = parseInt(apuestaEl.value);
  if (isNaN(apuesta) || apuesta <= 0) return alert("Ingresa apuesta válida");

  const snap = await getDoc(salaRef);
  const data = snap.data();

  let saldoJugador, saldoRival;
  if (jugadorKey === "jugador1") {
    saldoJugador = data.jugador1.saldo;
    saldoRival = data.jugador2 ? data.jugador2.saldo : null;
  } else {
    saldoJugador = data.jugador2.saldo;
    saldoRival = data.jugador1.saldo;
  }

  if (apuesta > saldoJugador) return alert("No tienes suficiente saldo");

  const resultado = Math.random() < 0.5 ? "cara" : "cruz";
  const ganador = eleccion === resultado ? jugadorKey : (jugadorKey === "jugador1" ? "jugador2" : "jugador1");
  const ganadorNombre = eleccion === resultado ? jugadorNombre : (jugadorKey === "jugador1" ? data.jugador2.nombre : data.jugador1.nombre);

  let update = {};
  if (ganador === "jugador1") {
    update["jugador1.saldo"] = (data.jugador1.saldo || 0) + apuesta;
    update["jugador2.saldo"] = (data.jugador2.saldo || 0) - apuesta;
  } else {
    update["jugador1.saldo"] = (data.jugador1.saldo || 0) - apuesta;
    update["jugador2.saldo"] = (data.jugador2.saldo || 0) + apuesta;
  }

  update["ultimoTiro"] = { ganador, ganadorNombre, resultado, apuesta };
  await updateDoc(salaRef, update);
}));
