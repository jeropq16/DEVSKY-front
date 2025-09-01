// frontend/js/admin.js
// Lógica para el panel de administrador

document.addEventListener('DOMContentLoaded', () => {
  // 1. Cargar aeronaves y mostrar su estado (disponible, mantenimiento, próximo mantenimiento)
  const contenedor = document.getElementById('aeronavesList');
  if (contenedor) cargarAeronaves();

  async function cargarAeronaves() {
    contenedor.innerHTML = '<div class="cargando">Cargando aeronaves...</div>';
    try {
      const resp = await fetch('http://localhost:3000/api/aeronaves');
      const data = await resp.json();
      if (data && data.success && Array.isArray(data.aeronaves)) {
        if (!data.aeronaves.length) {
          contenedor.innerHTML = '<div class="vacio">No hay aeronaves registradas.</div>';
        } else {
          let html = `<table class=\"tabla-aeronaves\"><thead><tr><th>Matrícula</th><th>Fabricante</th><th>Modelo</th><th>Estado</th><th>Horas Vuelo</th><th>Sumar Horas</th></tr></thead><tbody>`;
          data.aeronaves.forEach(a => {
            html += `<tr>
              <td>${a.matricula}</td>
              <td>${a.fabricante || ''}</td>
              <td>${a.modelo || ''}</td>
              <td><span class=\"estado-${a.estado}\">${a.estado.replace('_',' ')}</span></td>
              <td id='horas-${a.id}'>${a.total_horas_vuelo}</td>
              <td>
                <input type='number' min='1' style='width:60px' id='input-horas-${a.id}' placeholder='Horas'>
                <button onclick='sumarHoras(${a.id})'>Sumar</button>
                <span id='msg-horas-${a.id}' style='font-size:0.9em;'></span>
              </td>
            </tr>`;
          });
          html += '</tbody></table>';
          contenedor.innerHTML = html;
          // Exponer función global para sumar horas
          window.sumarHoras = async function(aeronaveId) {
            const input = document.getElementById('input-horas-' + aeronaveId);
            const msg = document.getElementById('msg-horas-' + aeronaveId);
            const horas = parseInt(input.value);
            if (!horas || horas < 1) {
              msg.textContent = ' Ingresa un valor válido';
              return;
            }
            msg.textContent = ' Guardando...';
            try {
              const resp = await fetch(`http://localhost:3000/api/aeronaves/${aeronaveId}/horas`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ horas })
              });
              const data = await resp.json();
              if (data && data.success) {
                msg.textContent = ' ✅';
                // Actualizar horas en la tabla
                const horasTd = document.getElementById('horas-' + aeronaveId);
                horasTd.textContent = parseInt(horasTd.textContent) + horas;
                input.value = '';
              } else {
                msg.textContent = ' Error al guardar';
              }
            } catch {
              msg.textContent = ' Error de conexión';
            }
            setTimeout(() => { msg.textContent = ''; }, 2000);
          }
        }
      } else {
        contenedor.innerHTML = '<div class="error">Error al cargar aeronaves.</div>';
      }
    } catch (err) {
      contenedor.innerHTML = '<div class="error">No se pudo conectar con el servidor.</div>';
    }
  }

  // ...aquí irán las demás funciones para el admin
});
// backend/routes/tareas.js