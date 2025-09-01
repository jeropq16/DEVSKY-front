// frontend/js/pdf.js
// Función para descargar PDF de órdenes de trabajo

function descargarPDF(ordenId) {
  if (!ordenId) {
    alert('ID de orden no válido');
    return;
  }
  
  const url = `http://localhost:3000/api/pdf/orden/${ordenId}`;
  const link = document.createElement('a');
  link.href = url;
  link.download = `orden_${ordenId}.pdf`;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Hacer la función global para uso en HTML
window.descargarPDF = descargarPDF;