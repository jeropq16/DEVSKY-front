// frontend/js/piloto.js
// Lógica para el panel de piloto

document.addEventListener('DOMContentLoaded', () => {
  // 1. Formulario de reporte de vuelo (matrícula, horas, trayecto, fecha, reporte, acción correctiva, firma)
  // 2. Autocompletar datos de aeronave al ingresar matrícula
  // 3. Enviar reporte (notifica al admin)
  // 4. Mostrar notificaciones

  const form = document.getElementById('reportePilotoForm');
  const matriculaInput = document.getElementById('matricula');
  const datosAeronaveDiv = document.getElementById('datosAeronave');
  const msgReporte = document.getElementById('msgReporte');

  // Autocompletar datos de aeronave al ingresar matrícula
  matriculaInput.addEventListener('blur', async () => {
    const matricula = matriculaInput.value.trim();
    if (!matricula) return;
    datosAeronaveDiv.textContent = 'Buscando datos...';
    try {
      const resp = await fetch('https://devsky-back.vercel.app/api/aeronaves');
      const data = await resp.json();
      if (data && data.success && Array.isArray(data.aeronaves)) {
        const aero = data.aeronaves.find(a => a.matricula.toLowerCase() === matricula.toLowerCase());
        if (aero) {
          datosAeronaveDiv.innerHTML = `Marca: <b>${aero.marca||''}</b> | Modelo: <b>${aero.modelo||''}</b> | Año: <b>${aero.anio_fabricacion||''}</b> | Serie: <b>${aero.serie_numero||''}</b> | Horas: <b>${aero.total_horas_vuelo}</b>`;
          document.getElementById('horas_vuelo').value = aero.total_horas_vuelo;
        } else {
          datosAeronaveDiv.textContent = 'No se encontró la aeronave.';
        }
      } else {
        datosAeronaveDiv.textContent = 'Error al buscar aeronave.';
      }
    } catch {
      datosAeronaveDiv.textContent = 'Error de conexión.';
    }
  });

  // Enviar reporte de vuelo
  form && form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msgReporte.textContent = 'Enviando...';
    const matricula = matriculaInput.value.trim();
    const horas_vuelo = document.getElementById('horas_vuelo').value;
    const trayecto_salida = document.getElementById('trayecto_salida').value;
    const trayecto_llegada = document.getElementById('trayecto_llegada').value;
    const fecha = document.getElementById('fecha').value;
    const reporte = document.getElementById('reporte').value;
    const accion_correctiva = document.getElementById('accion_correctiva').value;
    const firma_piloto = document.getElementById('firma_piloto').value;

    // Buscar id de aeronave por matrícula
    let aeronave_id = null;
    try {
      const resp = await fetch('https://devsky-back.vercel.app/api/aeronaves');
      const data = await resp.json();
      if (data && data.success && Array.isArray(data.aeronaves)) {
        const aero = data.aeronaves.find(a => a.matricula.toLowerCase() === matricula.toLowerCase());
        if (aero) aeronave_id = aero.id;
      }
    } catch {}
    if (!aeronave_id) {
      msgReporte.textContent = 'No se encontró la aeronave.';
      return;
    }

    // Suponiendo que el id del piloto está en sessionStorage
    const piloto_id = sessionStorage.getItem('userId');
    if (!piloto_id) {
      msgReporte.textContent = 'No se encontró el usuario piloto.';
      return;
    }

    try {
      const resp = await fetch('https://devsky-back.vercel.app/api/reportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          piloto_id, aeronave_id, horas_vuelo, trayecto_salida, trayecto_llegada, fecha, reporte, accion_correctiva, firma_piloto
        })
      });
      const data = await resp.json();
      if (data && data.success) {
        msgReporte.textContent = '✅ Reporte enviado correctamente';
        form.reset();
        datosAeronaveDiv.textContent = '';
      } else {
        msgReporte.textContent = 'Error al enviar el reporte.';
      }
    } catch {
      msgReporte.textContent = 'Error de conexión.';
    }
  });
});
// 5. Mostrar notificaciones (usando notificaciones del navegador)