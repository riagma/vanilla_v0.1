import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { observarContexto, getToken, getTipoUsuario, getUsuario } from './contexto.js';
import { vistaLogin } from './vistas/vistaLogin.js';
import { vistaVotante } from './vistas/vistaVotante.js';
import { vistaAdmin } from './vistas/vistaAdmin.js';
import { crearLayout } from './componentes/layout.js';
import { TIPO_USUARIO } from './utils/constantes.js';

// Crear layout una única vez y guardar función de limpieza
const app = document.getElementById('app');
const { contenidoPrincipal, nombreUsuario, limpiar: limpiarLayout } = crearLayout(app);

// Rutas protegidas por tipo de usuario
const RUTAS = {
  [TIPO_USUARIO.VOTANTE]: {
    '/': vistaVotante,
    '/elecciones': vistaVotante,
    '/eleccion/:id': null,
  },
  [TIPO_USUARIO.ADMIN]: {
    '/': vistaAdmin,
    '/elecciones': vistaAdmin,
    '/eleccion/:id': null,
  }
};

let limpiezaVistaActual = null;
let cancelarSuscripcionContexto = null;

function limpiarAplicacion() {
  console.log('Limpiando aplicación...');
  
  // Limpiar suscripción al contexto
  if (cancelarSuscripcionContexto) {
    cancelarSuscripcionContexto();
    cancelarSuscripcionContexto = null;
  }

  // Limpiar layout
  if (limpiarLayout) {
    console.log('Limpiando layout...');
    limpiarLayout();
  }

  // Limpiar vista actual
  if (limpiezaVistaActual) {
    console.log('Limpiando vista actual...');
    limpiezaVistaActual();
    limpiezaVistaActual = null;
  }
}

function render() {

  const token = getToken();
  const hash = location.hash.slice(1) || '/';

  console.log(`Renderizando vista para hash: ${hash} con token: ${token}`);

  // Limpiar vista anterior si existe
  limpiezaVistaActual?.();
  limpiezaVistaActual = null;
  

  // Si no hay token, mostrar login
  if (!token) {
    hash === '/' ? limpiezaVistaActual = vistaLogin(contenidoPrincipal) : navegarA('/');
    return;
  }

  // Si hay token, actualizar header y mostrar vista correspondiente
  const tipoUsuario = getTipoUsuario();
  const usuario = getUsuario();

  // Actualizar header
  nombreUsuario.textContent = usuario?.nombre || '';

  // Obtener rutas disponibles según tipo de usuario
  const rutasDisponibles = RUTAS[tipoUsuario];
  if (!rutasDisponibles) {
    console.error('Tipo de usuario no válido:', tipoUsuario);
    return;
  }

  // Encontrar y renderizar vista correspondiente
  const vista = rutasDisponibles[hash];
  if (vista) {
    limpiezaVistaActual = vista(contenidoPrincipal);
  } else {
    // Redirigir a ruta por defecto si no existe
    location.hash = '#/';
  }
}

console.log('Inicializando aplicación...');

// Suscribirse solo a cambios de autenticación
cancelarSuscripcionContexto = observarContexto((contextoInmutable) => {
  contextoInmutable.token === null && navegarA('/');
});

// Escuchar cambios de navegación
window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);
window.addEventListener('beforeunload', () => { limpiarAplicacion(); });

// Función helper para navegación
export function navegarA(ruta) {
    location.hash = '#' + ruta;
}
