// app.js - Módulo principal de la SPA de votación modularizado con contenedor y limpieza

// Servicio de elecciones (debes proveer este módulo)
import { servicioEleccion } from '../servicios/servicioEleccion.js';
import { parsearFechaHora } from '../utiles/utilesFechas.js';

let elections = [];

function obtenerEstadoEleccion(el) {
  const ahora = new Date();
  const fechaInicioRegistro = parsearFechaHora(el.fechaInicioRegistro, {});
  if (ahora < fechaInicioRegistro) return 'futuras';
  const fechaFinVotacion = parsearFechaHora(el.fechaFinVotacion, {});
  if (ahora > fechaFinVotacion) return 'pasadas';
  return 'actuales';
}

/**
 * Monta el componente de votación en el contenedor dado.
 * @param {HTMLElement} container - Elemento donde renderizar la SPA
 * @returns {Function} cleanup - Función para quitar listeners y liberar recursos
 */
export async function vistaPanel(container) {
  // Cargar elecciones desde el servicio
  try {
    elections = await servicioEleccion.cargarElecciones();
  } catch (err) {
    console.error('Error cargando elecciones:', err);
    container.innerHTML = '<p class="text-danger">No se pudieron cargar las elecciones.</p>';
    return () => { };
  }

  // Insertar estructura HTML básica
  container.innerHTML = `
    <nav class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex align-items-center">
        <img src="avatar.png" alt="Avatar" class="rounded-circle me-2" width="40" height="40">
        <div>
          <h5 id="userName" class="mb-0">Votante</h5>
          <small class="text-muted">Votante registrado</small>
        </div>
      </div>
      <button id="logoutBtn" class="btn btn-outline-secondary">Cerrar sesión</button>
    </nav>
    <ul class="nav nav-tabs mb-3" id="electionTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" data-status="futuras" data-bs-toggle="tab" type="button">Futuras</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" data-status="actuales" data-bs-toggle="tab" type="button">En Curso</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" data-status="pasadas" data-bs-toggle="tab" type="button">Pasadas</button>
      </li>
    </ul>
    <div class="tab-content" id="electionContent">
      <div class="tab-pane fade show active" data-status-container="futuras">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"></div>
      </div>
      <div class="tab-pane fade" data-status-container="actuales">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"></div>
      </div>
      <div class="tab-pane fade" data-status-container="pasadas">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"></div>
      </div>
    </div>
  `;

  // Helper para renderizar
  function renderElections(status) {
    const pane = container.querySelector(`[data-status-container="${status}"] .row`);
    let memoHTML = '';
    elections
      .filter(e => obtenerEstadoEleccion(e) === status)
      .forEach(election => {
        const algoLink = `https://algoexplorer.io/application/${election.appId}`;
        memoHTML += `
          <div class="col">
            <div class="card h-100">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${election.nombre}</h5>
                <p class="card-text flex-grow-1">${election.descripcion}</p>
                <ul class="list-unstyled small mb-3">
                  <li><strong>Registro:</strong> ${election.fechaInicioRegistro} a ${election.fechaFinRegistro}</li>
                  <li><strong>Votación:</strong> ${election.fechaInicioVotacion} a ${election.fechaFinVotacion}</li>
                  <li><strong>Escrutinio:</strong> ${election.fechaEscrutinio}</li>
                  <li><strong>App ID:</strong> <a href="${algoLink}" target="_blank">${election.appId}</a></li>
                  <li><strong>App Addr:</strong> ${election.appAddr}</li>
                  <li><strong>Token ID:</strong> ${election.tokenId}</li>
                </ul>
                <button class="btn btn-primary mt-auto">${status === 'futuras' ? 'Ver detalles' :
            status === 'actuales' ? 'Ir a votar' :
              'Ver resultados'
          }</button>
              </div>
            </div>
          </div>
        `;
      });
    pane.innerHTML = memoHTML;
  }

  // Bind eventos\ n   
  const tabButtons = Array.from(container.querySelectorAll('#electionTabs button'));
  tabButtons.forEach(btn => btn.addEventListener('click', onTabClick));

  function onTabClick(e) {
    const status = e.target.getAttribute('data-status');
    // Cambiar clases de pestañas
    tabButtons.forEach(b => b.classList.toggle('active', b === e.target));
    // Mostrar contenido
    container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('show', 'active'));
    const pane = container.querySelector(`[data-status-container="${status}"]`);
    pane.classList.add('show', 'active');
    // Renderizar
    renderElections(status);
  }

  // Render inicial
  renderElections('futuras');

  // Logout
  const logoutBtn = container.querySelector('#logoutBtn');
  logoutBtn.addEventListener('click', () => alert('Sesión cerrada'));

  // Cleanup
  return () => {
    tabButtons.forEach(btn => btn.removeEventListener('click', onTabClick));
    logoutBtn.removeEventListener('click', () => alert('Sesión cerrada'));
  };
}
