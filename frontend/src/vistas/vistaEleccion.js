// vistas/vistaEleccion.js
import { servicioEleccion } from '../servicios/servicioEleccion.js';
import { servicioVotante } from '../servicios/servicioVotante.js';
import { formatearFecha, parsearFechaHora } from '../utiles/utilesFechas.js';
import { limpiarComponentes, limpiarManejadores } from '../utiles/utilesVistas.js';
import { componentePartido } from '../componentes/componentePartido.js';
import { componentePresentarse } from '../componentes/componentePresentarse.js';
import { componenteRegistroUsuario } from '../componentes/componenteRegistroUsuario.js';
import { componenteVotacionUsuario } from '../componentes/componenteVotacionUsuario.js';
import { componenteResultados } from '../componentes/componenteResultados.js';
import { navegarA } from '../rutas/enrutado.js';

/**  
 * Determina el estado global de la elección  
 * @returns 'futura' | 'enCurso' | 'pasada'  
 */
function obtenerEstadoEleccion(el) {
  const ahora = new Date();
  const inicioRegistro = parsearFechaHora(el.fechaInicioRegistro);
  const finRegistro = parsearFechaHora(el.fechaFinRegistro);
  const inicioVoto = parsearFechaHora(el.fechaInicioVotacion);
  const finVoto = parsearFechaHora(el.fechaFinVotacion);
  const escrutinio = parsearFechaHora(el.fechaEscrutinio);

  if (ahora < inicioRegistro) return 'futura';
  if (ahora <= escrutinio) return 'enCurso';
  return 'pasada';
}

/**
 * Monta la vista de detalle de una elección dentro de `container`.  
 * @param {HTMLElement} container 
 * @param {number|string} idEleccion 
 * @returns {Function} cleanup 
 */
export function vistaEleccion(container, idEleccion) {
  let destruida = false;
  const componentes = new Set();
  const manejadores = new Set();

  // 1) Esqueleto base
  container.innerHTML = `
    <div class="container py-4">
      <button id="btnVolver" class="btn btn-link mb-3">&larr; Volver</button>
      <div id="electionHeader"></div>
      <ul class="nav nav-tabs" id="detalleTabs" role="tablist"></ul>
      <div class="tab-content mt-3" id="detallePanes"></div>
    </div>
  `;
  // Volver
  const btnVolver = container.querySelector('#btnVolver');
  btnVolver.addEventListener('click', () => navegarA('/p'));
  manejadores.add([btnVolver, 'click', null]);

  // 2) Carga de datos
  let eleccion, estado, partidos, resultados;
  let votante, estaEnCenso, registroUsuario, votoUsuario;

  async function cargarDatos() {
    try {
      eleccion = await servicioEleccion.cargarEleccion(idEleccion);
      partidos = await servicioEleccion.cargarPartidos(idEleccion);
      resultados = await servicioEleccion.cargarResultados(idEleccion);
    } catch (err) {
      container.innerHTML = `<div class="alert alert-danger">Error al cargar datos: ${err.message}</div>`;
      return () => { };
    }

    estado = obtenerEstadoEleccion(eleccion);

    try {
      votante = await servicioVotante.cargarVotante();
      estaEnCenso = !!votante;

      if (estaEnCenso) {
        registroUsuario = await servicioVotante.cargarRegistroEleccion(idEleccion);
        votoUsuario = await servicioVotante.cargarVotoEleccion(idEleccion);
      }
    } catch (err) {
      container.innerHTML = `<div class="alert alert-danger">Error al cargar datos: ${err.message}</div>`;
      return () => { };
    }
    if (destruida) return;
    renderizar();
  }

  //--------------
  cargarDatos();
  //--------------

  function renderizar() {
    if (destruida) return;
    limpiarComponentes(componentes);

    // fechas parseadas
    const inicioReg = formatearFecha(parsearFechaHora(eleccion.fechaInicioRegistro));
    const finReg = formatearFecha(parsearFechaHora(eleccion.fechaFinRegistro));
    const inicioVot = formatearFecha(parsearFechaHora(eleccion.fechaInicioVotacion));
    const finVot = formatearFecha(parsearFechaHora(eleccion.fechaFinVotacion));
    const escru = formatearFecha(parsearFechaHora(eleccion.fechaEscrutinio));
    const linkAlgo = eleccion.appId
      ? `https://algoexplorer.io/application/${eleccion.appId}`
      : '#';

    // 3) Header con info básica
    const hdr = container.querySelector('#electionHeader');
    hdr.innerHTML = `
      <h2>${eleccion.nombre}</h2>
      <p>${eleccion.descripcion}</p>
      <ul class="list-unstyled small">
        <li><strong>Registro:</strong> ${inicioReg} – ${finReg}</li>
        <li><strong>Votación:</strong> ${inicioVot} – ${finVot}</li>
        <li><strong>Escrutinio:</strong> ${escru}</li>
        <li><strong>Blockchain:</strong> 
          <a href="${linkAlgo}" target="_blank">${eleccion.appId}</a>
        </li>
      </ul>
    `;

    // 4) Construcción dinámica de pestañas
    const tabs = [];
    const panes = [];
    // Siempre: Información
    tabs.push({ id: 'info', label: 'Información', active: true });
    panes.push({ id: 'info', contenedor: document.createElement('div') });

    // Futuras → “Presentarse”
    if (estado === 'futura' && estaEnCenso) {
      tabs.push({ id: 'presentarse', label: 'Presentarse' });
      panes.push({ id: 'presentarse', contenedor: document.createElement('div') });
    }
    // En curso → Registro y/o Votación
    if (estado === 'enCurso') {
      const ahora = new Date();
      if (ahora < parsearFechaHora(eleccion.fechaFinRegistro)) {
        tabs.push({ id: 'registro', label: 'Registro' });
        panes.push({ id: 'registro', contenedor: document.createElement('div') });
      }
      if (ahora < parsearFechaHora(eleccion.fechaEscrutinio)) {
        tabs.push({ id: 'votacion', label: 'Votación' });
        panes.push({ id: 'votacion', contenedor: document.createElement('div') });
      }
    }
    // Pasadas → siempre Resultados (y mostrar registro/voto históricos)
    if (estado === 'pasada') {
      tabs.push({ id: 'registro', label: 'Registro' });
      panes.push({ id: 'registro', contenedor: document.createElement('div') });
      tabs.push({ id: 'votacion', label: 'Votación' });
      panes.push({ id: 'votacion', contenedor: document.createElement('div') });
      tabs.push({ id: 'resultados', label: 'Resultados' });
      panes.push({ id: 'resultados', contenedor: document.createElement('div') });
    }

    // Render pestañas y contenedores
    const ulTabs = container.querySelector('#detalleTabs');
    const divPanes = container.querySelector('#detallePanes');
    tabs.forEach(({ id, label, active }) => {
      const li = document.createElement('li');
      li.className = 'nav-item';
      li.innerHTML = `<button class="nav-link ${active ? 'active' : ''}" 
                         id="tab-${id}" data-bs-toggle="tab" 
                         data-bs-target="#pane-${id}" type="button">
                     ${label}
                    </button>`;
      ulTabs.appendChild(li);
    });
    panes.forEach(({ id, contenedor }) => {
      contenedor.id = `pane-${id}`;
      contenedor.className = `tab-pane fade ${id === 'info' ? 'show active' : ''}`;
      divPanes.appendChild(contenedor);
    });

    // 5) Renderizado de cada pestaña llamando al componente
    // — Información (ej. lista de partidos)
    const paneInfo = panes.find(p => p.id === 'info').contenedor;
    const rowPartidos = document.createElement('div');
    rowPartidos.className = 'row row-cols-1 row-cols-md-2 g-3';
    paneInfo.appendChild(rowPartidos);
    partidos.forEach(partido => {
      const cont = document.createElement('div');
      const cleanup = componentePartido(cont, partido);
      componentes.add(cleanup);
      rowPartidos.appendChild(cont);
    });

    // — Presentarse
    if (estado === 'futura' && estaEnCenso) {
      const paneP = panes.find(p => p.id === 'presentarse').contenedor;
      const cleanup = componentePresentarse(paneP, idEleccion, votante);
      componentes.add(cleanup);
    }

    // — Registro
    if (panes.some(p => p.id === 'registro')) {
      const paneR = panes.find(p => p.id === 'registro').contenedor;
      const esPeriodReg = new Date() < parsearFechaHora(eleccion.fechaFinRegistro);
      const cleanup = componenteRegistroUsuario(
        paneR,
        idEleccion,
        registroUsuario,
        esPeriodReg,
        votante
      );
      componentes.add(cleanup);
    }

    // — Votación
    if (panes.some(p => p.id === 'votacion')) {
      const paneV = panes.find(p => p.id === 'votacion').contenedor;
      const ahora = new Date();
      const dentroVoto =
        ahora >= parsearFechaHora(eleccion.fechaInicioVotacion) &&
        ahora < parsearFechaHora(eleccion.fechaFinVotacion);
      const despuesVoto =
        ahora >= parsearFechaHora(eleccion.fechaFinVotacion) &&
        ahora < parsearFechaHora(eleccion.fechaEscrutinio);
      const cleanup = componenteVotacionUsuario(
        paneV,
        idEleccion,
        partidos,
        votoUsuario,
        dentroVoto,
        despuesVoto,
        votante
      );
      componentes.add(cleanup);
    }

    // — Resultados
    if (panes.some(p => p.id === 'resultados')) {
      const paneX = panes.find(p => p.id === 'resultados').contenedor;
      const cleanup = componenteResultados(paneX, resultados, partidos, votante);
      componentes.add(cleanup);
    }
  }

  // 6) listeners de pestañas (Bootstrap se encarga del cambio; aquí no necesitamos JS extra)
  //    Si necesitaras lógica adicional al cambiar tab, podrías escuchar 'shown.bs.tab' aquí.

  // 7) Cleanup total
  return () => {
    destruida = true;
    limpiarComponentes(componentes);
    limpiarManejadores(manejadores);
  };
}
