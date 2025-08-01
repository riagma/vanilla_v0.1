import { formatearFecha } from '../utiles/utilesFechas.js';

export function fichaEleccion(contenedor, eleccion, onVerDetalle) {
  let manejadores = new Set();

  function renderizar() {
    limpiarManejadores(manejadores);

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
      manejadores.add([boton, 'click', handler]);
    }
  }

  // Renderizado inicial
  renderizar();

  // Retornar función de limpieza
  return () => {
    limpiarManejadores(manejadores);
  };
}