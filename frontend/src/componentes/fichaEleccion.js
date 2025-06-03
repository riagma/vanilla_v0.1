import { formatearFecha } from '../utiles/formateo.js';

export function fichaEleccion(contenedor, eleccion, onVerDetalle) {
  let eventListeners = new Set();

  function limpiar() {
    // Limpiar event listeners
    eventListeners.forEach(([elem, event, handler]) => {
      elem.removeEventListener(event, handler);
    });
    eventListeners.clear();
  }

  function renderizar() {
    // Limpiar antes de re-renderizar
    limpiar();

    contenedor.innerHTML = `
      <div class="col">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${eleccion.nombre}</h5>
            <p class="card-text">${eleccion.descripcion}</p>
            <div class="mb-2">
              <small class="text-muted">
                Estado: ${eleccion.estado}
              </small>
            </div>
            <button class="btn btn-primary btn-detalle">
              Ver Detalles
            </button>
          </div>
          <div class="card-footer">
            <small class="text-muted">
              Votación: ${formatearFecha(eleccion.fechaInicioVotacion)} 
              - ${formatearFecha(eleccion.fechaFinVotacion)}
            </small>
          </div>
        </div>
      </div>
    `;

    // Registrar nuevos listeners
    const boton = contenedor.querySelector('.btn-detalle');
    if (boton) {
      const handler = () => onVerDetalle(eleccion.id);
      boton.addEventListener('click', handler);
      eventListeners.add([boton, 'click', handler]);
    }
  }

  // Renderizado inicial
  renderizar();

  // Retornar función de limpieza
  return limpiar;
}