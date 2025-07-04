import { contexto } from '../modelo/contexto.js';
import { navegarA } from '../rutas/enrutado.js';
import { servicioLogin } from '../servicios/servicioLogin.js';
import { limpiarManejadores } from '../utiles/utilesVistas.js';

export function crearMarco(contenedor) {
  let manejadores = new Set();
  let nombreVotante = contexto.getNombreVotante() || '';
  let nombreUsuario = contexto.getNombreUsuario() || '';

  function renderizarCabecera() {
    limpiarManejadores(manejadores);

    const tituloVoto3 = document.getElementById('tituloVoto3');
    if (!tituloVoto3) {
      console.error('No se encontró el contenedor del título Voto3');
      return;
    }

    if (nombreVotante) {
      tituloVoto3.innerHTML = `
        <span id="tituloVoto3"
          style="display:inline-block; font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
                 font-weight: 900; font-size: 2em; color: #28a745; /* verde */
                 text-shadow: 0 1px 6px #28a74555; letter-spacing: 2px;">
          Voto3
        </span>
      `;
    } else if (nombreUsuario) {
      tituloVoto3.innerHTML = `
        <span id="tituloVoto3"
          style="display:inline-block; font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
                 font-weight: 900; font-size: 2em; color: #007bff; /* azul */
                 text-shadow: 0 1px 6px #007bff55; letter-spacing: 2px;">
          Voto3
        </span>
      `;
    } else {
      tituloVoto3.innerHTML = `
        <span id="tituloVoto3"
          style="display:inline-block; font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
                 font-weight: 900; font-size: 2em; color: #fff;
                 text-shadow: 0 1px 6px #007bff55; letter-spacing: 2px;">
          Voto3
        </span>
      `;
    }

    // const cabeceraAcciones = document.getElementById('cabeceraAcciones');
    // if (!cabeceraAcciones) {
    //   console.error('No se encontró el contenedor de acciones de la cabecera');
    //   return;
    // }

    // cabeceraAcciones.innerHTML = nombre
    //   ? `
    //     <div class="d-flex align-items-center">
    //       <span class="text-light me-3">${nombre}</span>
    //       <button id="botonCerrarSesion" class="btn btn-outline-light">Cerrar Sesión</button>
    //     </div>
    //   `
    //   : '';

    // const botonCerrarSesion = document.getElementById('botonCerrarSesion');
    // if (botonCerrarSesion) {
    //   const manejarCierreSesion = () => {
    //     servicioLogin.logout();
    //     navegarA('/');
    //   };
    //   botonCerrarSesion.addEventListener('click', manejarCierreSesion);
    //   manejadores.add([botonCerrarSesion, 'click', manejarCierreSesion]);
    // }
  }

  function renderizar() {
    limpiarManejadores(manejadores);

    contenedor.innerHTML = `
      <div class="d-flex flex-column min-vh-100">
        <!-- Cabecera fija -->
        <header class="bg-dark text-white py-3">
          <div class="container">
            <div class="d-flex flex-column align-items-center justify-content-center">
              <h1 class="h4 mb-0 text-center">Sistema de Votación</h1>
              <div class="mt-1 mb-2 w-100 d-flex justify-content-center">
                <span id="tituloVoto3" style="display:inline-block; font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace; font-weight: 900; font-size: 2em; color: #fff; text-shadow: 0 1px 6px #007bff55; letter-spacing: 2px;">Voto3</span>
              </div>
              <div id="cabeceraAcciones" class="w-100 d-flex justify-content-end"></div>
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
            <p class="text-muted mb-0">© ${new Date().getFullYear()} Sistema de Votación Voto3</p>
          </div>
        </footer>
      </div>
    `;

    renderizarCabecera();
  }

  const cancelarSuscripcion = contexto.observarContexto((estado) => {
    const nombreVotanteNuevo = contexto.getNombreVotante() || '';
    const nombreUsuarioNuevo = contexto.getNombreUsuario() || '';
    if (nombreUsuarioNuevo !== nombreUsuario || nombreVotanteNuevo !== nombreVotante) {
      nombreVotante = contexto.getNombreVotante() || '';
      nombreUsuario = contexto.getNombreUsuario() || '';
      renderizarCabecera(); 
    }
  });

  renderizar();

  return {
    contenedorMarco: document.getElementById('contenedorMarco'),
    limpiarMarco: () => {
      cancelarSuscripcion();
      limpiarManejadores(manejadores);
    }
  };
}