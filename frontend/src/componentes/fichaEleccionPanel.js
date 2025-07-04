import { limpiarManejadores } from '../utiles/utilesVistas.js';

export function fichaEleccionPanel(contenedor, eleccion, status, onAccion) {
  let manejadores = new Set();

  function renderizar() {
    limpiarManejadores(manejadores);

    const algoLink = eleccion.appId ? `https://algoexplorer.io/application/${eleccion.appId}` : '';
    
    contenedor.innerHTML = `
      <div class="col">
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${eleccion.nombre}</h5>
            <p class="card-text flex-grow-1">${eleccion.descripcion}</p>
            <ul class="list-unstyled small mb-3">
              <li><strong>Registro:</strong> ${eleccion.fechaInicioRegistro} a ${eleccion.fechaFinRegistro}</li>
              <li><strong>Votación:</strong> ${eleccion.fechaInicioVotacion} a ${eleccion.fechaFinVotacion}</li>
              <li><strong>Escrutinio:</strong> ${eleccion.fechaEscrutinio}</li>
              <li><strong>Blockchain:</strong> <a href="${algoLink}" target="_blank">${eleccion.appId}</a></li>
            </ul>
            <button class="btn btn-primary mt-auto btn-accion" data-election-id="${eleccion.id}">
              ${status === 'futuras' ? 'Ver detalles' : status === 'actuales' ? 'Ir a votar' : 'Ver resultados'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Registrar nuevos listeners
    const boton = contenedor.querySelector('.btn-accion');
    if (boton) {
      const handler = () => onAccion(eleccion.id, status);
      boton.addEventListener('click', handler);
      manejadores.add([boton, 'click', handler]);
    }
  }

  // Renderizado inicial
  renderizar();

  return () => {
    limpiarManejadores(manejadores);
  };
}
