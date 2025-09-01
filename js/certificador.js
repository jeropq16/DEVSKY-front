// frontend/js/certificador.js
// Lógica para el panel del certificador (incluye funciones del inspector)

document.addEventListener('DOMContentLoaded', () => {
  // 🔹 Elementos del DOM
  const tareasList = document.getElementById('misTareasList') || document.body;
  const globalTareasList = document.getElementById('tareasList');
  const asignarForm = document.getElementById('asignarForm');
  const tecnicoSelect = document.getElementById('tecnico');
  const asignarMsg = document.getElementById('asignarMsg');

  // 🔹 Obtener id del certificador de sessionStorage
  const certificadorId = sessionStorage.getItem('userId');
  if (!certificadorId) {
    tareasList.innerHTML = '<div class="error">No se encontró el ID del certificador. Inicia sesión nuevamente.</div>';
    return;
  }

  // ============================
  // 📌 Parte 1: Funciones de Certificador
  // ============================

  // Cargar ítems asignados al certificador
  async function cargarMisItems() {
    tareasList.innerHTML = '<div class="cargando">Cargando ítems...</div>';
    try {
      const resp = await fetch(`http://localhost:3000/api/ordenes/certificador/${certificadorId}`);
      const data = await resp.json();
      if (data && data.success && Array.isArray(data.items)) {
        if (!data.items.length) {
          tareasList.innerHTML = '<div class="vacio">No tienes ítems asignados.</div>';
        } else {
          let html = '<ul class="lista-tareas">';
          data.items.forEach(item => {
            const yaFirmado = !!item.firma_certificador;
            html += `<li>
              <b>${item.descripcion}</b> <br>
              Estado: ${item.estado} <br>
              ${yaFirmado 
                ? `<span style='color:green;'>✅ Ya firmado</span>` 
                : `<button class="btn-firmar" data-itemid="${item.id}">Seleccionar para firmar</button>`}
            </li>`;
          });
          html += '</ul>';
          tareasList.innerHTML = html;

          // Asignar eventos a los botones de firmar
          document.querySelectorAll('.btn-firmar').forEach(btn => {
            btn.addEventListener('click', function() {
              window.itemIdSeleccionado = this.getAttribute('data-itemid');
              document.getElementById('msgFirma').textContent = 'Ítem seleccionado para firmar.';
            });
          });
        }
      } else {
        tareasList.innerHTML = '<div class="error">Error al cargar ítems.</div>';
      }
    } catch {
      tareasList.innerHTML = '<div class="error">No se pudo conectar con el servidor.</div>';
    }
  }

  // ============================
  // 📌 Parte 2: Funciones de Inspector
  // ============================

  // Cargar técnicos disponibles
  async function cargarTecnicos() {
    try {
      const resp = await fetch('http://localhost:3000/api/usuarios/tecnicos');
      const data = await resp.json();
      
      tecnicoSelect.innerHTML = '';
      
      if (data && data.success && Array.isArray(data.tecnicos)) {
        if (data.tecnicos.length === 0) {
          tecnicoSelect.innerHTML = '<option value="">No hay técnicos disponibles</option>';
        } else {
          tecnicoSelect.innerHTML = '<option value="">Selecciona un técnico...</option>';
          data.tecnicos.forEach(tecnico => {
            const opt = document.createElement('option');
            opt.value = tecnico.id;
            opt.textContent = `${tecnico.nombre} (${tecnico.email})`;
            tecnicoSelect.appendChild(opt);
          });
        }
      } else {
        tecnicoSelect.innerHTML = '<option value="">Error al cargar técnicos</option>';
      }
    } catch {
      tecnicoSelect.innerHTML = '<option value="">Error de conexión</option>';
    }
  }

  // Listar todas las tareas globales
  window.cargarTareasGlobales = async function() {
    if (!globalTareasList) return;
    globalTareasList.innerHTML = '<div class="cargando">Cargando tareas...</div>';
    try {
      const resp = await fetch('http://localhost:3000/api/tareas');
      const data = await resp.json();
      if (data && data.success && Array.isArray(data.tareas)) {
        if (!data.tareas.length) {
          globalTareasList.innerHTML = '<div class="vacio">No hay tareas registradas.</div>';
        } else {
          globalTareasList.innerHTML = '';
          for (const tarea of data.tareas) {
            const div = document.createElement('div');
            div.className = 'tarea-card';
            div.innerHTML = `
              <div class="tarea-desc">${tarea.descripcion}</div>
              <div class="tarea-detalles">
                <span class="tarea-tecnico">👨‍🔧 Técnico: <b>${tarea.tecnico_nombre || 'Sin asignar'}</b></span>
                <span class="tarea-estado estado-${(tarea.estado||'').replace(/\s/g, '').toLowerCase()}">Estado: ${tarea.estado||'Sin estado'}</span>
              </div>
            `;
            globalTareasList.appendChild(div);
          }
        }
      } else {
        globalTareasList.innerHTML = '<div class="error">Error al cargar tareas.</div>';
      }
    } catch {
      globalTareasList.innerHTML = '<div class="error">No se pudo conectar con el servidor.</div>';
    }
  };

  // Asignar nueva tarea
  if (asignarForm) {
    asignarForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      asignarMsg.textContent = '';
      asignarMsg.className = 'mensaje';
      
      const descripcion = document.getElementById('descripcion').value.trim();
      const id_tecnico_asignado = tecnicoSelect.value;
      
      if (!descripcion || !id_tecnico_asignado) {
        asignarMsg.textContent = 'Completa todos los campos.';
        asignarMsg.className = 'mensaje error';
        return;
      }
      
      asignarMsg.textContent = 'Asignando tarea...';
      
      try {
        const resp = await fetch('http://localhost:3000/api/tareas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ descripcion, id_tecnico_asignado })
        });
        const data = await resp.json();
        if (data && data.success) {
          asignarMsg.textContent = '✅ Tarea asignada correctamente.';
          asignarMsg.className = 'mensaje exito';
          asignarForm.reset();
          cargarTareasGlobales();
        } else {
          asignarMsg.textContent = (data && data.message) || 'Error al asignar tarea.';
          asignarMsg.className = 'mensaje error';
        }
      } catch {
        asignarMsg.textContent = 'No se pudo conectar con el servidor.';
        asignarMsg.className = 'mensaje error';
      }
    });
  }

  // ============================
  // Inicializar ambas vistas
  // ============================
  cargarMisItems();       // ítems del certificador
  cargarTecnicos();       // técnicos disponibles
  cargarTareasGlobales(); // todas las tareas
});