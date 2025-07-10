// app.js - Módulo principal de la SPA de votación modularizado con contenedor y limpieza

// Servicio de elecciones (debes proveer este módulo)
import { servicioEleccion } from '../servicios/servicioEleccion.js';
import { servicioLogin } from '../servicios/servicioLogin.js';
import { parsearFechaHora } from '../utiles/utilesFechas.js';
import { fichaEleccionPanel } from '../componentes/fichaEleccionPanel.js';
import { limpiarComponentes, limpiarManejadores } from '../utiles/utilesVistas.js';
import { navegarA } from '../rutas/enrutado.js';

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
export function vistaPanel(container) {

  let destruida = false;

  let componentes = new Set();
  let manejadores = new Set();

  let elecciones = [];



  async function cargarElecciones() {
    try {
      // console.log('Cargando elecciones...');
      elecciones = await servicioEleccion.cargarElecciones();
      // console.log('Elecciones cargadas:', elecciones);
      if (destruida) return;
      renderizar('actuales');
    } catch (error) {
      if (destruida) return;
      console.error('Error al cargar elecciones:', error);
      mostrarError('Error al cargar las elecciones');
    }
  }

  //--------------
  cargarElecciones();
  //--------------

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
        <button class="nav-link" data-status="pasadas" data-bs-toggle="tab" type="button">Pasadas</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link active" data-status="actuales" data-bs-toggle="tab" type="button">En Curso</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" data-status="futuras" data-bs-toggle="tab" type="button">Futuras</button>
      </li>
    </ul>
    <div class="tab-content" id="electionContent">
      <div class="tab-pane fade" data-status-container="pasadas">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"></div>
      </div>
      <div class="tab-pane fade show active" data-status-container="actuales">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"></div>
      </div>
      <div class="tab-pane fade" data-status-container="futuras">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"></div>
      </div>
    </div>
  `;

  function renderizar(status) {
    const panel = container.querySelector(`[data-status-container="${status}"] .row`);
    
    // Limpiar fichas anteriores
    limpiarComponentes(componentes);
    
    // Limpiar contenedor
    panel.innerHTML = '';
    
    // Renderizar nuevas fichas
    elecciones
      .filter(e => obtenerEstadoEleccion(e) === status)
      .forEach(election => {
        const fichaContainer = document.createElement('div');
        const limpiarFicha = fichaEleccionPanel(fichaContainer, election, status, manejarAccionEleccion);
        componentes.add(limpiarFicha);
        panel.appendChild(fichaContainer.firstElementChild);
      });
  }

  // Manejar acciones de las fichas
  function manejarAccionEleccion(eleccionId, status) {
    const eleccion = elecciones.find(e => e.id === eleccionId);
    if (!eleccion) return;

    navegarA(`/e/${eleccionId}`);
    
    // switch(status) {
    //   case 'futuras':
    //     // Mostrar detalles de la elección
    //     alert(`Ver detalles de: ${eleccion.nombre}`);
    //     break;
    //   case 'actuales':
    //     // Ir a votar
    //     alert(`Ir a votar en: ${eleccion.nombre}`);
    //     break;
    //   case 'pasadas':
    //     // Ver resultados
    //     alert(`Ver resultados de: ${eleccion.nombre}`);
    //     break;
    // }
  }

  // Bind eventos\ n   
  const tabButtons = Array.from(container.querySelectorAll('#electionTabs button'));
  tabButtons.forEach(btn => btn.addEventListener('click', onTabClick));
  tabButtons.forEach(btn => manejadores.add([btn, 'click', onTabClick]));


  function onTabClick(e) {
    const status = e.target.getAttribute('data-status');
    // Cambiar clases de pestañas
    tabButtons.forEach(b => b.classList.toggle('active', b === e.target));
    // Mostrar contenido
    container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('show', 'active'));
    const pane = container.querySelector(`[data-status-container="${status}"]`);
    pane.classList.add('show', 'active');
    // Renderizar
    renderizar(status);
  }

  // Render inicial
  // renderElections('futuras');

  // Logout
  function onCerrarSesion() {
    servicioLogin.logout();
    navegarA('/');
  } 
  const logoutBtn = container.querySelector('#logoutBtn');
  logoutBtn.addEventListener('click', onCerrarSesion);
  manejadores.add([logoutBtn, 'click', onCerrarSesion]);

  // Cleanup
  return () => {
    destruida = true;
    limpiarComponentes(componentes);
    limpiarManejadores(manejadores);
  };
}
