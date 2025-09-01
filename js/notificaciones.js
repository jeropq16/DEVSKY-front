/// frontend/js/notificaciones.js
// Conexión a WebSocket para recibir notificaciones en tiempo real
const socket = io("http://localhost:3000");

// Escuchar notificaciones y mostrarlas en la UI
socket.on("notificacion", (data) => {
  mostrarNotificacion(data);
});

function mostrarNotificacion(data) {
  // data = { titulo, mensaje, rol }
  const lista = document.getElementById("notificaciones");

  const texto = `[${data.rol.toUpperCase()}] ${data.titulo}: ${data.mensaje}`;

  if (lista) {
    const li = document.createElement("li");
    li.textContent = texto;
    lista.appendChild(li);
  } else {
    // fallback en caso de no tener lista en UI
    alert("Notificación: " + texto);
  }
}

// 📡 Escuchar nuevas órdenes en tiempo real
socket.on("orden_generada", (orden) => {
  const listaHistorial = document.getElementById("historial-ordenes");
  if (listaHistorial) {
    const li = document.createElement("li");
    li.textContent = `Orden #${orden.id} - Aeronave ${orden.aeronave_id} - ${orden.tipo_mantenimiento}h`;
    listaHistorial.appendChild(li);
  }
});
