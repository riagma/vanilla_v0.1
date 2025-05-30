import { inicializarHeader } from './header.js';

export function crearLayout(contenedor) {
  let limpiezaHeader = null;

  contenedor.innerHTML = `
    <div class="d-flex flex-column min-vh-100">
      <!-- Cabecera fija -->
      <header class="bg-dark text-white py-3">
        <div class="container">
          <div class="d-flex justify-content-between align-items-center">
            <h1 class="h4 mb-0">Sistema de Votación</h1>
            <div class="d-flex align-items-center">
              <span id="nombreUsuario" class="me-3"></span>
              <div id="headerAcciones"></div>
            </div>
          </div>
        </div>
      </header>

      <!-- Contenido dinámico -->
      <main class="flex-grow-1">
        <div id="contenidoPrincipal" class="container py-4">
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

  const headerAcciones = document.getElementById('headerAcciones');
  const contenidoPrincipal = document.getElementById('contenidoPrincipal');
  const nombreUsuario = document.getElementById('nombreUsuario');

  // Inicializar header con su propia suscripción y guardar función de limpieza
  limpiezaHeader = inicializarHeader(headerAcciones);

  // Retornar referencias y función de limpieza
  return {
    contenidoPrincipal,
    headerAcciones,
    nombreUsuario,
    limpiar: () => {
      if (limpiezaHeader) {
        limpiezaHeader();
        limpiezaHeader = null;
      }
    }
  };
}