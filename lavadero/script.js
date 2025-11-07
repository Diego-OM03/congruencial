// script.js
document.getElementById('configForm').addEventListener('submit', e => {
e.preventDefault();
const puestosMotos = parseInt(document.getElementById('puestosMotos').value);
const puestosAutos = parseInt(document.getElementById('puestosAutos').value);
const tiempoMoto = parseFloat(document.getElementById('tiempoMoto').value);
const tiempoAuto = parseFloat(document.getElementById('tiempoAuto').value);
const factorPico = parseFloat(document.getElementById('factorPico').value);
const horaPico = document.getElementById('horaPico').value;


const llegadas = generarLlegadas(horaPico, factorPico);
const resultados = simular(llegadas, puestosMotos, puestosAutos, tiempoMoto, tiempoAuto);
mostrarResultados(resultados);
});


function generarLlegadas(horaPico, factorPico) {
const arr = [];
for (let h = 8; h <= 18; h++) {
if (h === 12 || h === 13) continue; // horario de almuerzo
const base = Math.random() * 4 + 1; // entre 1 y 5 llegadas
const total = h >= parseInt(horaPico.split(':')[0]) ? Math.ceil(base * factorPico) : Math.ceil(base);
for (let i = 0; i < total; i++) {
const min = Math.floor(Math.random() * 60);
const tipoVeh = Math.random() < 0.5 ? 'Moto' : 'Auto';
const tipoOrd = Math.random() < 0.4 ? 'Ordinaria' : 'Prioritaria';
arr.push({hora: `${h}:${min.toString().padStart(2,'0')}`, tipoVeh, tipoOrd});
}
}
return arr.sort((a,b)=>a.hora.localeCompare(b.hora));
}


function simular(llegadas, puestosMotos, puestosAutos, tMoto, tAuto) {
const resultados = [];
const bahiasMotos = Array(puestosMotos).fill(8*60);
const bahiasAutos = Array(puestosAutos).fill(8*60);


llegadas.forEach(c => {
const [h,m] = c.hora.split(':').map(Number);
const llegadaMin = h*60+m;
const duracion = c.tipoVeh==='Moto'?tMoto:(Math.random()*10+25);
const bahias = c.tipoVeh==='Moto'?bahiasMotos:bahiasAutos;
const idx = bahias.indexOf(Math.min(...bahias));
const inicio = Math.max(llegadaMin,bahias[idx]);
const espera = inicio - llegadaMin;
const fin = inicio + duracion;
bahias[idx] = fin;
resultados.push({...c,bahia: idx+1,inicio: minToHora(inicio),fin: minToHora(fin),espera});
});
return resultados;
}


function mostrarResultados(res) {
const tbody = document.querySelector('#tablaResultados tbody');
tbody.innerHTML = '';
let totalEspera = 0;
res.forEach(r => {
totalEspera += r.espera;
const tr = document.createElement('tr');
tr.innerHTML = `<td>${r.hora}</td><td>${r.tipoVeh}</td><td>${r.tipoOrd}</td><td>${r.bahia}</td><td>${r.inicio}</td><td>${r.fin}</td><td>${r.espera.toFixed(1)}</td>`;
tbody.appendChild(tr);
});
const promedio = (totalEspera/res.length).toFixed(2);
document.getElementById('resumen').innerHTML = `<p><strong>Total clientes:</strong> ${res.length} | <strong>Espera promedio:</strong> ${promedio} min</p>`;
}


function minToHora(m){
const h=Math.floor(m/60)%24;
const mm=Math.floor(m%60);
return `${h.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')}`;
}