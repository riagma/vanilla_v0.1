import { servicioEleccion } from '../servicios/servicioEleccion.js';
import { servicioVotante } from '../servicios/servicioVotante.js';
import { fichaEleccion } from '../componentes/fichaEleccion.js';
import { navegarA } from '../rutas/enrutado.js';

export function vistaVotante(contenedor) {
  let elecciones = [];
  let componentes = new Set();
  let destruida = false;

  function manejarVerDetalle(idEleccion) {
    navegarA(`/e/${idEleccion}`);
  }

  async function cargarElecciones() {
    try {
      // console.log('Cargando elecciones...');
      elecciones = await servicioEleccion.cargarElecciones();
      // console.log('Elecciones cargadas:', elecciones);
      if (destruida) return;
      renderizar();
    } catch (error) {
      if (destruida) return;
      console.error('Error al cargar elecciones:', error);
      mostrarError('Error al cargar las elecciones');
    }
  }

  function mostrarError(mensaje) {
    contenedor.innerHTML = `
      <div class="container mt-4">
        <div class="alert alert-danger" role="alert">
          ${mensaje}
        </div>
      </div>
    `;
  }

  function renderizar() {
    componentes.forEach(fn => fn());
    componentes.clear();

    // Simplificar la estructura HTML
    contenedor.innerHTML = `
      <div class="container mt-4">
        <h2 class="mb-4">Elecciones Disponibles</h2>
        ${!elecciones.length 
          ? '<div class="alert alert-info">Cargando elecciones...</div>'
          : '<div id="listaElecciones" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"></div>'
        }
      </div>
    `;

    if (!elecciones.length) return;

    const listaElecciones = contenedor.querySelector('#listaElecciones');
    if (!listaElecciones) {
      console.error('No se encontró el contenedor de elecciones');
      return;
    }

    // Renderizar cada ficha de elección
    elecciones.forEach(eleccion => {
      const contenedorFicha = document.createElement('div');
      contenedorFicha.className = 'col';
      listaElecciones.appendChild(contenedorFicha);
      const limpiarFicha = fichaEleccion(contenedorFicha, eleccion, manejarVerDetalle);
      componentes.add(limpiarFicha);
    });
  }

  renderizar();
  cargarElecciones();

  // Retornar función de limpieza
  return () => {
    destruida = true;
    console.log('Limpiando vista votante');
    componentes.forEach(fn => fn());
    componentes.clear();
  };
}