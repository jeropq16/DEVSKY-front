// frontend/js/ordenes.js
// Funciones para manejar órdenes de trabajo

document.addEventListener('DOMContentLoaded', () => {
  // Función global para generar orden de mantenimiento
  window.generarOrden = async function(aeronaveId, tipoMantenimiento) {
    if (!aeronaveId || !tipoMantenimiento) {
      alert('Datos incompletos para generar orden');
      return;
    }

    try {
      const response = await fetch('https://devsky-back.vercel.app/api/ordenes/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aeronave_id: aeronaveId,
          tipo_mantenimiento: tipoMantenimiento
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`✅ Orden generada exitosamente. ID: ${data.orden_id}`);
        // Recargar la página o actualizar la lista
        if (typeof cargarOrdenes === 'function') {
          cargarOrdenes();
        }
      } else {
        alert('Error al generar orden: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      alert('Error de conexión al generar orden');
      console.error('Error:', error);
    }
  };

  // Función para cargar órdenes existentes
  window.cargarOrdenes = async function() {
    const contenedor = document.getElementById('ordenesList');
    if (!contenedor) return;

    contenedor.innerHTML = '<div class="cargando">Cargando órdenes...</div>';

    try {
      const response = await fetch('https://devsky-back.vercel.app/api/ordenes');
      const data = await response.json();

      if (data.success && Array.isArray(data.ordenes)) {
        if (data.ordenes.length === 0) {
          contenedor.innerHTML = '<div class="vacio">No hay órdenes registradas.</div>';
        } else {
          let html = '<div class="ordenes-grid">';
          data.ordenes.forEach(orden => {
            html += `
              <div class="orden-card">
                <h3>Orden #${orden.id}</h3>
                <p><strong>Aeronave:</strong> ${orden.aeronave_id}</p>
                <p><strong>Estado:</strong> <span class="estado-${orden.estado}">${orden.estado}</span></p>
                <p><strong>Progreso:</strong> ${orden.porcentaje_avance}%</p>
                <p><strong>Fecha:</strong> ${new Date(orden.fecha_inicio).toLocaleDateString()}</p>
                <div class="orden-acciones">
                  <button onclick="descargarPDF(${orden.id})" class="btn-pdf">📄 PDF</button>
                  <button onclick="verDetalles(${orden.id})" class="btn-detalles">👁️ Ver</button>
                </div>
              </div>
            `;
          });
          html += '</div>';
          contenedor.innerHTML = html;
        }
      } else {
        contenedor.innerHTML = '<div class="error">Error al cargar órdenes.</div>';
      }
    } catch (error) {
      contenedor.innerHTML = '<div class="error">Error de conexión.</div>';
      console.error('Error:', error);
    }
  };

  // Función para ver detalles de orden
  window.verDetalles = function(ordenId) {
    alert(`Ver detalles de orden ${ordenId} - Funcionalidad en desarrollo`);
  };

  // Auto-cargar órdenes si existe el contenedor
  if (document.getElementById('ordenesList')) {
    cargarOrdenes();
  }
});