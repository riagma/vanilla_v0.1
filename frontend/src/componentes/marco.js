import { observarContexto, getToken, getUsuario } from '../contexto.js';
import { navegarA } from '../rutas/enrutado.js';
import { servicioLogin } from '../servicios/servicioLogin.js';
import { limpiarManejadores } from '../utiles/utiles.js';

export function crearMarco(contenedor) {
  let manejadores = new Set();
  let token = getToken();
  let usuario = getUsuario();

  function renderizarCabecera() {
    limpiarManejadores(manejadores);

    const cabeceraAcciones = document.getElementById('cabeceraAcciones');
    if (!cabeceraAcciones) {
      console.error('No se encontró el contenedor de acciones de la cabecera');
      return;
    }

    cabeceraAcciones.innerHTML = token
      ? `
        <div class="d-flex align-items-center">
          <span class="text-light me-3">${usuario?.nombre || ''}</span>
          <button id="botonCerrarSesion" class="btn btn-outline-light">Cerrar Sesión</button>
        </div>
      `
      : '';

    const botonCerrarSesion = document.getElementById('botonCerrarSesion');
    if (botonCerrarSesion) {
      const manejarCierreSesion = () => {
        servicioLogin.logout();
        navegarA('/');
      };
      botonCerrarSesion.addEventListener('click', manejarCierreSesion);
      manejadores.add([botonCerrarSesion, 'click', manejarCierreSesion]);
    }
  }

  function renderizar() {
    limpiarManejadores(manejadores);

    contenedor.innerHTML = `
      <div class="d-flex flex-column min-vh-100">
        <!-- Cabecera fija -->
        <header class="bg-dark text-white py-3">
          <div class="container">
            <div class="d-flex justify-content-between align-items-center">
              <h1 class="h4 mb-0">Sistema de Votación</h1>
              <div id="cabeceraAcciones"></div>
            </div>
          </div>
        </header>

        <!-- Contenido dinámico -->
        <main class="flex-grow-1">
          <div id="contenedorMarco" class="container py-4">
            <!-- Aquí se renderizará el contenido específico -->
          </div>
        </main>

        <!-- Pie fijo -->
        <footer class="bg-light py-3 mt-auto">
          <div class="container text-center">
            <p class="text-muted mb-0">© ${new Date().getFullYear()} Sistema de Votación</p>
          </div>
        </footer>
      </div>
    `;

    renderizarCabecera();
  }

  const cancelarSuscripcion = observarContexto((contextoInmutable) => {
    if (token !== contextoInmutable.token || usuario !== contextoInmutable.usuario) {
      token = contextoInmutable.token;
      usuario = contextoInmutable.usuario;
      renderizarCabecera(); // Solo actualiza la cabecera
    }
  });

  renderizar();

  return {
    contenedorMarco: document.getElementById('contenedorMarco'),
    limpiarMarco: () => {
      cancelarSuscripcion?.();
      limpiarManejadores(manejadores);
    }
  };
}