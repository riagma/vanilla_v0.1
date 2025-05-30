import { observarContexto, getToken, getUsuario } from '../contexto.js';
import { servicioLogin } from '../servicios/servicioLogin.js';

export function inicializarHeader(contenedor) {
  let eventListeners = new Set();

  function render() {
    const token = getToken();
    const usuario = getUsuario();

    // Limpiar event listeners anteriores
    eventListeners.forEach(([elem, event, handler]) => {
      elem.removeEventListener(event, handler);
    });
    eventListeners.clear();

    contenedor.innerHTML = token 
      ? `
        <div class="d-flex align-items-center">
          <button id="btnLogout" class="btn btn-outline-light">
            Cerrar Sesión
          </button>
        </div>
      `
      : '';

    // Registrar nuevos event listeners si hay botón
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      const handleLogout = () => servicioLogin.logout();
      btnLogout.addEventListener('click', handleLogout);
      eventListeners.add([btnLogout, 'click', handleLogout]);
    }
  }

  // Suscribirse a cambios de autenticación
  const cancelarSuscripcion = observarContexto((contextoInmutable) => {
    if (contextoInmutable.token !== getToken()) {
      render();
    }
  });

  // Renderizado inicial
  render();

  // Retornar función de limpieza
  return () => {
    if (cancelarSuscripcion) {
      cancelarSuscripcion();
    }
    eventListeners.forEach(([elem, event, handler]) => {
      elem.removeEventListener(event, handler);
    });
    eventListeners.clear();
  };
}