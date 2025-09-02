function generar() {
  let x = parseInt(document.getElementById("x0").value);
  let a = parseInt(document.getElementById("a").value);
  let c = parseInt(document.getElementById("c").value);
  let m = parseInt(document.getElementById("m").value);

  if (isNaN(x) || isNaN(a) || isNaN(c) || isNaN(m)) {
    alert("Por favor, rellena todos los campos con números válidos.");
    return;
  }

  let vistos = new Set();
  let i = 0;
  let filas = "";

  while (!vistos.has(x)) {
    vistos.add(x);
    let siguiente = (a * x + c) % m;
    let uniforme = (siguiente / m).toFixed(5);

    filas += `<tr>
                <td>${i}</td>
                <td>${x}</td>
                <td>${siguiente}</td>
                <td>${uniforme}</td>
              </tr>`;

    x = siguiente;
    i++;
  }

  let periodo = vistos.size;

  let tabla = `
    <h2>Secuencia Generada</h2>
    <table>
      <thead>
        <tr>
          <th>i</th>
          <th>x</th>
          <th>(a·Xn + c) mod m</th>
          <th>#uniforme</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
      </tbody>
    </table>
    <p>⚠️ La secuencia se repite en i = ${i}</p>
    <p>🔄 Período: <b>${periodo}</b></p>
  `;

  document.getElementById("resultado").innerHTML = tabla;
}
