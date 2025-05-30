import { observarContexto, getDatosVotante } from '../contexto.js';
import { servicioVotante } from '../servicios/servicioVotante.js';
import { fichaEleccion } from '../componentes/fichaEleccion.js';
import { navegarA } from '../main.js';

export function vistaVotante(contenedor) {
  let elecciones = [];
  let cancelarSuscripcion;
  let limpiezaComponentes = new Set();
  let datosVotanteActual = getDatosVotante();
  let destruida = false;

  function mostrarError(mensaje) {
    if (destruida) return;
    contenedor.innerHTML = `
      <div class="container mt-4">
        <div class="alert alert-danger" role="alert">
          ${mensaje}
        </div>
      </div>
    `;
  }

  function handleVerDetalle(idEleccion) {
    navegarA(`/eleccion/${idEleccion}`);
  }

  function renderizarElecciones() {
    if (destruida) return;
    
    // Limpiar componentes anteriores
    limpiezaComponentes.forEach(fn => fn());
    limpiezaComponentes.clear();

    // Crear contenedor para las elecciones
    contenedor.innerHTML = `
      <div class="container mt-4">
        <h2 class="mb-4">Elecciones Disponibles</h2>
        <div id="listaElecciones" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          ${!elecciones.length ? '<div class="col-12"><div class="alert alert-info">Cargando elecciones...</div></div>' : ''}
        </div>
      </div>
    `;

    if (!elecciones.length) return;

    const listaElecciones = document.getElementById('listaElecciones');

    // Renderizar cada ficha de elección
    elecciones.forEach(eleccion => {
      const contenedorFicha = document.createElement('div');
      listaElecciones.appendChild(contenedorFicha);
      const limpiarFicha = fichaEleccion(contenedorFicha, eleccion, handleVerDetalle);
      limpiezaComponentes.add(limpiarFicha);
    });
  }

  // Primera renderización (estado de carga)
  renderizarElecciones();

  // Cargar datos
  servicioVotante.cargarElecciones()
    .then(datos => {
      if (destruida) return;
      elecciones = datos;
      renderizarElecciones();
    })
    .catch(error => {
      if (destruida) return;
      mostrarError(error.message);
    });

  // Suscribirse a cambios
  cancelarSuscripcion = observarContexto((contextoInmutable) => {
    if (destruida) return;
    const nuevosDatosVotante = contextoInmutable.datosVotante;
    if (JSON.stringify(nuevosDatosVotante) !== JSON.stringify(datosVotanteActual)) {
      datosVotanteActual = nuevosDatosVotante;
      renderizarElecciones();
    }
  });

  // Retornar función de limpieza
  return () => {
    destruida = true;
    cancelarSuscripcion?.();
    limpiezaComponentes.forEach(fn => fn());
    limpiezaComponentes.clear();
  };
}