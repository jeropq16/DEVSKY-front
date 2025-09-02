// frontend/js/firma.js
// Funciones para manejo de firmas digitales

document.addEventListener('DOMContentLoaded', () => {
  // Función global para firmar ítem
  window.firmarItem = async function() {
    const itemId = window.itemIdSeleccionado;
    const firmaInput = document.getElementById('firmaInput');
    const msgFirma = document.getElementById('msgFirma');
    
    if (!itemId) {
      msgFirma.textContent = 'Primero selecciona un ítem para firmar.';
      return;
    }
    
    if (!firmaInput || !firmaInput.value.trim()) {
      msgFirma.textContent = 'Ingresa tu firma digital.';
      return;
    }
    
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      msgFirma.textContent = 'No se encontró el usuario. Inicia sesión nuevamente.';
      return;
    }
    
    msgFirma.textContent = 'Guardando firma...';
    
    try {
      const response = await fetch(`https://devsky-back.vercel.app/api/ordenes/firma/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firma: firmaInput.value.trim(),
          usuario_id: userId
        })
      });
      
      const data = await response.json();
      if (data.success) {
        msgFirma.textContent = '✅ Firma guardada exitosamente.';
        firmaInput.value = '';
        window.itemIdSeleccionado = null;
        
        // Recargar la lista de ítems
        setTimeout(() => {
          if (typeof cargarMisItems === 'function') {
            cargarMisItems();
          }
          msgFirma.textContent = '';
        }, 2000);
      } else {
        msgFirma.textContent = 'Error: ' + (data.message || 'No se pudo guardar la firma');
      }
    } catch (error) {
      msgFirma.textContent = 'Error de conexión.';
      console.error('Error:', error);
    }
  };
  
  // Configurar el botón de firma si existe
  const btnFirmar = document.getElementById('btnFirmar');
  if (btnFirmar) {
    btnFirmar.addEventListener('click', firmarItem);
  }
});