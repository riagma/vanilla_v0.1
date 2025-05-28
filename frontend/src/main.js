import { contexto, setToken, limpiarSesion } from './contexto.js';
import { loginForm } from './vistas/login.js';
import { vistaProtegida } from './vistas/protegida.js';

function render() {
  const hash = location.hash || '#/';
  const app = document.getElementById('app');

  if (hash === '#/' || !contexto.token) {
    app.innerHTML = '';
    loginForm(app, async (token) => {
      setToken(token);
      render();
    });
  } else {
    app.innerHTML = '';
    vistaProtegida(app, limpiarSesion);
  }
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);
