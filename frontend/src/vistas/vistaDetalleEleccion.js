import { observarContexto, getDatosVotante } from '../contexto.js';
import { servicioVotante } from '../servicios/servicioVotante.js';
import { formatearFecha } from '../utiles/formateo.js';
import { navegarA } from '../rutas/enrutado.js';

export function vistaDetalleEleccion(contenedor, idEleccion) {
  let detalleEleccion = null;
  let limpiezaComponentes = new Set();
  let datosVotanteActual = getDatosVotante();
  let destruida = false;

  async function cargarDetalle() {
    try {
      detalleEleccion = await servicioVotante.cargarDetalleEleccion(idEleccion);
      if (destruida) return;
      renderizar();
    } catch (error) {
      if (destruida) return;
      console.error('Error al cargar detalle:', error);
      mostrarError('Error al cargar los detalles de la elección');
    }
  }

  function mostrarError(mensaje) {
    contenedor.innerHTML = `
      <div class="container mt-4">
        <div class="alert alert-danger" role="alert">${mensaje}</div>
      </div>
    `;
  }

  function obtenerEstadoActual() {
    const ahora = new Date();
    const eleccion = detalleEleccion.eleccion;
    
    if (ahora >= new Date(eleccion.fechaCelebracion)) {
      return 'RESULTADOS';
    }
    if (ahora >= new Date(eleccion.fechaInicioVotacion) && 
        ahora <= new Date(eleccion.fechaFinVotacion)) {
      return 'VOTACION';
    }
    if (ahora >= new Date(eleccion.fechaInicioRegistro) && 
        ahora <= new Date(eleccion.fechaFinRegistro)) {
      return 'REGISTRO';
    }
    return 'PENDIENTE';
  }

  function renderizarAcciones(estadoActual) {
    const registroVotante = detalleEleccion.registroVotante;
    
    if (estadoActual === 'REGISTRO') {
      if (!registroVotante) {
        return `<button id="botonRegistro" class="btn btn-primary">Registrarme</button>`;
      }
      return `
        <div class="alert alert-info">
          Estado de registro: ${registroVotante.estado}
          ${registroVotante.motivoRechazo ? `<br>Motivo: ${registroVotante.motivoRechazo}` : ''}
        </div>
      `;
    }
    
    if (estadoActual === 'VOTACION') {
      if (!registroVotante || registroVotante.estado !== 'ACEPTADO') {
        return `<div class="alert alert-warning">No estás registrado para votar</div>`;
      }
      if (!detalleEleccion.registroVotante.haVotado) {
        return `<button id="botonVotar" class="btn btn-primary">Votar</button>`;
      }
      return `<div class="alert alert-success">Ya has votado en esta elección</div>`;
    }
    
    return '';
  }

  function renderizarResultados() {
    if (!detalleEleccion.resultados) return '';
    
    const { participacion, totalVotos, censados, resultadosPorPartido } = detalleEleccion.resultados;
    
    return `
      <div class="card mt-4">
        <div class="card-cabecera">
          <h3>Resultados</h3>
        </div>
        <div class="card-body">
          <div class="row mb-4">
            <div class="col-md-4">
              <h5>Participación: ${participacion.toFixed(2)}%</h5>
              <p>Total votos: ${totalVotos} de ${censados} censados</p>
            </div>
          </div>
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            ${resultadosPorPartido.map(resultado => `
              <div class="col">
                <div class="card h-100">
                  <div class="card-body">
                    <h5 class="card-title">${resultado.nombrePartido}</h5>
                    <div class="progress mb-2">
                      <div class="progress-bar" role="progressbar" 
                           style="width: ${resultado.porcentaje}%">
                        ${resultado.porcentaje.toFixed(2)}%
                      </div>
                    </div>
                    <p class="card-text">Votos: ${resultado.votos}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderizar() {
    limpiezaComponentes.forEach(fn => fn());
    limpiezaComponentes.clear();

    if (!detalleEleccion) {
      contenedor.innerHTML = `
        <div class="container mt-4">
          <div class="alert alert-info">Cargando detalles de la elección...</div>
        </div>
      `;
      return;
    }

    const estadoActual = obtenerEstadoActual();
    const { eleccion, partidos } = detalleEleccion;

    contenedor.innerHTML = `
      <div class="container mt-4">
        <h2 class="mb-4">${eleccion.nombre}</h2>
        <div class="card mb-4">
          <div class="card-body">
            <p class="card-text">${eleccion.descripcion}</p>
            <div class="row">
              <div class="col-md-6">
                <h5>Período de registro</h5>
                <p>Del ${formatearFecha(eleccion.fechaInicioRegistro)} 
                   al ${formatearFecha(eleccion.fechaFinRegistro)}</p>
              </div>
              <div class="col-md-6">
                <h5>Período de votación</h5>
                <p>Del ${formatearFecha(eleccion.fechaInicioVotacion)} 
                   al ${formatearFecha(eleccion.fechaFinVotacion)}</p>
              </div>
            </div>
            ${renderizarAcciones(estadoActual)}
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-cabecera">
            <h3>Partidos Participantes</h3>
          </div>
          <div class="card-body">
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              ${partidos.map(partido => `
                <div class="col">
                  <div class="card h-100">
                    ${partido.logo ? `
                      <img src="${partido.logo}" class="card-img-top" alt="${partido.nombre}">
                    ` : ''}
                    <div class="card-body">
                      <h5 class="card-title">${partido.nombre}</h5>
                      <h6 class="card-subtitle mb-2 text-muted">${partido.siglas}</h6>
                      ${partido.programa ? `
                        <a href="${partido.programa}" class="btn btn-outline-primary btn-sm">
                          Ver Programa
                        </a>
                      ` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        ${estadoActual === 'RESULTADOS' ? renderizarResultados() : ''}
      </div>
    `;

    inicializarManejadores(estadoActual);
  }

  function inicializarManejadores(estadoActual) {
    if (estadoActual === 'REGISTRO') {
      const botonRegistro = document.getElementById('botonRegistro');
      if (botonRegistro) {
        const manejarRegistro = async () => {
          try {
            await servicioVotante.registrarEnEleccion(idEleccion);
            await cargarDetalle();
          } catch (error) {
            mostrarError(error.message);
          }
        };
        botonRegistro.addEventListener('click', manejarRegistro);
        limpiezaComponentes.add([botonRegistro, 'click', manejarRegistro]);
      }
    }

    if (estadoActual === 'VOTACION') {
      const botonVotar = document.getElementById('botonVotar');
      if (botonVotar) {
        const manejarVotar = () => navegarA(`/eleccion/${idEleccion}/votar`);
        botonVotar.addEventListener('click', manejarVotar);
        limpiezaComponentes.add([botonVotar, 'click', manejarVotar]);
      }
    }
  }

  // Renderizado inicial y carga de datos
  renderizar();
  cargarDetalle();

  // Suscripción a cambios del contexto
  const cancelarSuscripcion = observarContexto((contextoInmutable) => {
    if (destruida) return;
    const nuevosDatosVotante = contextoInmutable.datosVotante;
    if (JSON.stringify(nuevosDatosVotante) !== JSON.stringify(datosVotanteActual)) {
      datosVotanteActual = nuevosDatosVotante;
      cargarDetalle();
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