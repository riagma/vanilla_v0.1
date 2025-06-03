import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { getToken, getTipoUsuario } from './contexto.js';
import { crearMarco } from './componentes/marco.js';
import { obtenerVista, vistaInicial, navegarA } from './rutas/enrutado.js';

// Crear marco una única vez y guardar función de limpieza
const app = document.getElementById('app');
const { contenedorMarco, limpiarMarco } = crearMarco(app);

let contenedorPrincipal = contenedorMarco;

let limpiarVistaActual = null;

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
  const token = getToken();
  const hash = location.hash.slice(1) || '/';

  const pistaToken = token?.slice(-5) || ''; 

  // const contenedorPrincipalDOM = document.getElementById(contenedorMarco);

  // if(!contenedorPrincipal.isSameNode(contenedorPrincipalDOM)) {
  //   console.log('Actualizando contenedor principal...');
  //   contenedorPrincipal = contenedorPrincipalDOM;
  // }

  //--------------

  console.log(`Renderizando vista para hash: ${hash} con token: ...${pistaToken}`);

  limpiarVistaActual?.();
  limpiarVistaActual = null;
  
  // Si no hay token, mostrar login
  if (!token) {
    hash === '/' ? limpiarVistaActual = vistaInicial(contenedorPrincipal) : navegarA('/');
    return;
  }

  //--------------

  // Si hay token, mostrar vista correspondiente
  const tipoUsuario = getTipoUsuario();
  
  try {
    const vista = obtenerVista(tipoUsuario, hash);
    if (vista) {
      limpiarVistaActual = vista(contenedorPrincipal);
    } else {
      // Mostrar alerta en lugar de redirigir
      alert(`La ruta "${hash}" no existe`);
      // Revertir la URL al estado anterior sin causar nuevo renderizado
      history.pushState(null, '', location.pathname);
    }
  } catch (error) {
    console.error(error);
    alert('Error al cargar la vista');
  }
}

//------------------------------------------------------------------------------

console.log('Inicializando aplicación...');

// Escuchar cambios de navegación
window.addEventListener('hashchange', renderizar);
window.addEventListener('DOMContentLoaded', renderizar);
window.addEventListener('beforeunload', () => { limpiarAplicacion(); });

//------------------------------------------------------------------------------

const observer = new MutationObserver((mutationsList) => {

  for(const mutation of mutationsList) {

    if(mutation.type === 'childList') {

      const padreContenedorActual = contenedorPrincipal.parentNode;

      if(!contenedorPrincipal.isConnected) {

        console.group('El contenedor principal ha sido removido o reemplazado');
        console.trace();
        console.groupEnd();

        contenedorPrincipal = document.getElementById('contenedorMarco');
      }
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

//------------------------------------------------------------------------------
