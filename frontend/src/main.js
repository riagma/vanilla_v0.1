import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { voto3IDB } from './modelo/voto3IDB.js';

import { crearMarco } from './componentes/marco.js';
import { obtenerVista } from './rutas/enrutado.js';

import { servicioCircuito } from './servicios/servicioCircuito.js';

//--------------
let contenedorMarco = null; 
let limpiarVistaActual = null;
let limpiarMarco = null;
//--------------

    // "@aztec/bb.js": "^0.87.9",
    // "@noir-lang/noir_js": "^1.0.0-beta.7",
    // "@noir-lang/noir_wasm": "^1.0.0-beta.8",

    // "@aztec/bb.js": "0.63.1",
    // "@noir-lang/noir_js": "1.0.0-beta.0",
    // "@noir-lang/noir_wasm": "1.0.0-beta.0",


//------------------------------------------------------------------------------

function limpiarAplicacion() {
  console.log('Limpiando aplicación...');

  if (limpiarMarco) {
    console.log('Limpiando marco...');
    limpiarMarco();
  }

  if (limpiarVistaActual) {
    console.log('Limpiando vista actual...');
    limpiarVistaActual();
    limpiarVistaActual = null;
  }
}

//------------------------------------------------------------------------------

function renderizar() {

  const hash = location.hash.slice(1) || '/';

  console.log(`Renderizando vista: ${hash}`);

  limpiarVistaActual?.();
  limpiarVistaActual = null;

  // Si no hay usuario, mostrar login
  // if (!contexto.getUsuario()) {
  //   hash === '/' ? limpiarVistaActual = vistaInicial(contenedorMarco) : navegarA('/');
  //   return;
  // }

  try {
    const vista = obtenerVista(hash);
    if (vista) {
      limpiarVistaActual = vista(contenedorMarco);
    } else {
      // Mostrar alerta en lugar de redirigir
      // alert(`La ruta "${hash}" no existe`);
      // Revertir la URL al estado anterior sin causar nuevo renderizado
      history.pushState(null, '', location.pathname);
    }
  } catch (error) {
    console.error(error);
    alert('Error al cargar la vista');
  }
}

//------------------------------------------------------------------------------

async function inicializarAplicacion() {
  console.log('Inicializando aplicación...');

  // Inicializar IndexedDB
  try {
    console.log('Inicializando IndexedDB...');
    const resultado = await voto3IDB.inicializar();
    if (!resultado) {
      throw new Error('No se pudo inicializar IndexedDB');
    }
  } catch (error) {
    console.error('Error al inicializar IndexedDB:', error);
    // Mostrar mensaje de error en la interfaz
    app.innerHTML = `
      <div class="alert alert-danger mt-5" role="alert">
        <h4 class="alert-heading">Error crítico</h4>
        <p>No se pudo inicializar el almacenamiento local del navegador (IndexedDB).</p>
        <hr>
        <p class="mb-0">La aplicación no puede funcionar correctamente. Prueba a recargar la página o usa otro navegador.</p>
      </div>
  `;
    // Opcional: deshabilitar más lógica
    throw error; // O simplemente return para no seguir ejecutando
  }

  const app = document.getElementById('app');
  const marco = crearMarco(app);
  contenedorMarco = marco.contenedorMarco;
  limpiarMarco = marco.limpiarMarco;
  console.log('Marco creado:', contenedorMarco);

  await servicioCircuito.testCircuito();
  
  renderizar();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarAplicacion);
} else { inicializarAplicacion(); }

// Escuchar cambios de navegación
window.addEventListener('hashchange', renderizar);
window.addEventListener('beforeunload', () => { limpiarAplicacion(); });

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// const observer = new MutationObserver((mutationsList) => {

//   for (const mutation of mutationsList) {

//     if (mutation.type === 'childList') {

//       const padreContenedorActual = contenedorMarco.parentNode;

//       if (!contenedorMarco.isConnected) {

//         console.group('El contenedor principal ha sido removido o reemplazado');
//         console.trace();
//         console.groupEnd();

//         contenedorMarco = document.getElementById('contenedorMarco');
//       }
//     }
//   }
// });

// observer.observe(document.body, {
//   childList: true,
//   subtree: true
// });

//------------------------------------------------------------------------------
