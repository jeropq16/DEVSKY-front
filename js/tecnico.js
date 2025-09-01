
// frontend/js/tecnico.js
// Lógica para la vista del técnico: ver y actualizar el estado de sus tareas.
// Completamente comentado para fácil comprensión.

document.addEventListener('DOMContentLoaded', () => {
  const misTareasList = document.getElementById('misTareasList');
  // Obtener el id del técnico desde sessionStorage (guardado al hacer login)
  const tecnicoId = sessionStorage.getItem('userId') || sessionStorage.getItem('tecnicoId');
  if (!tecnicoId) {
    misTareasList.innerHTML = '<div class="error">No se encontró el ID del técnico. Por favor, inicia sesión nuevamente.</div>';
    return;
  }

  // Cargar ítems de orden de trabajo asignados al técnico y permitir seleccionar para firmar
  async function cargarMisItems() {
    misTareasList.innerHTML = '<div class="cargando">Cargando ítems...';
    try {
      // Endpoint sugerido: /api/ordenes/tecnico/:id
      const resp = await fetch(`http://localhost:3000/api/ordenes/tecnico/${tecnicoId}`);
      const data = await resp.json();
      if (data && data.success && Array.isArray(data.items)) {
        if (!data.items.length) {
          misTareasList.innerHTML = '<div class="vacio">No tienes ítems asignados.</div>';
        } else {
          let html = '<ul class="lista-tareas">';
          data.items.forEach(item => {
            const yaFirmado = !!item.firma_tecnico;
            html += `<li>
              <b>${item.descripcion}</b> <br>
              Estado: ${item.estado} <br>
              ${yaFirmado ? `<span style='color:green;'>✅ Ya firmado</span>` : `<button class="btn-firmar" data-itemid="${item.id}">Seleccionar para firmar</button>`}
            </li>`;
          });
          html += '</ul>';
          misTareasList.innerHTML = html;
          // Asignar evento a los botones de firmar
          document.querySelectorAll('.btn-firmar').forEach(btn => {
            btn.addEventListener('click', function() {
              window.itemIdSeleccionado = this.getAttribute('data-itemid');
              document.getElementById('msgFirma').textContent = 'Ítem seleccionado para firmar.';
            });
          });
        }
      } else {
        misTareasList.innerHTML = '<div class="error">Error al cargar ítems.</div>';
      }
    } catch {
      misTareasList.innerHTML = '<div class="error">No se pudo conectar con el servidor.</div>';
    }
  }
  cargarMisItems();
});