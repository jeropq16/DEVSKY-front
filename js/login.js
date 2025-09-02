// frontend/js/login.js
// Lógica para el formulario de login: conecta con el backend y muestra mensajes de error.
// Completamente comentado para fácil comprensión.

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';

    // Obtiene los valores del formulario
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Llama a la API de login del backend
    try {
      const response = await fetch('https://devsky-back.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (data.success) {
        // Redirigir según el rol_id (1: admin, 2: técnico, 3: certificador, 4: piloto)
        sessionStorage.setItem('userId', data.user.id);
        sessionStorage.setItem('rolId', data.user.rol_id);
        if (data.user.rol_id === 1) {
          window.location.href = 'admin.html';
        } else if (data.user.rol_id === 2) {
          window.location.href = 'tecnico.html';
        } else if (data.user.rol_id === 3) {
          window.location.href = 'certificador.html';
        } else if (data.user.rol_id === 4) {
          window.location.href = 'piloto.html';
        } else {
          loginError.textContent = 'Rol de usuario desconocido.';
        }
      } else {
        loginError.textContent = data.message || 'Error de autenticación.';
      }
    } catch (error) {
      loginError.textContent = 'No se pudo conectar con el servidor.';
    }
  });
});