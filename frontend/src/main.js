import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { contexto, observarContexto } from './contexto.js';
import { vistaLogin } from './vistas/vistaLogin.js';
import { vistaVotante } from './vistas/vistaVotante.js';
import { vistaAdmin } from './vistas/vistaAdmin.js';
import { crearLayout } from './componentes/layout.js';

// Crear layout una única vez
const app = document.getElementById('app');
const { contenidoPrincipal, headerAcciones, nombreUsuario } = crearLayout(app);

function render() {
  const hash = location.hash || '#/';

  console.log('Renderizando con contexto:', contexto); // Debug

  // Actualizar nombre de usuario en header
  if (contexto.usuario) {
    nombreUsuario.textContent = contexto.usuario.nombre;
  } else {
    nombreUsuario.textContent = '';
  }

  if (!contexto.token) {
    vistaLogin(contenidoPrincipal);
    return;
  }

  console.log('Tipo de usuario:', contexto.tipoUsuario); // Debug

  if (contexto.tipoUsuario === 'VOTANTE') {
    vistaVotante(contenidoPrincipal);
  } else if (contexto.tipoUsuario === 'ADMIN') {
    vistaAdmin(contenidoPrincipal);
  }
}

// Suscribirse a cambios en el contexto
observarContexto(render);

// Escuchar cambios de navegación
window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);
