import { api } from '../servicios/api.js';

export async function vistaProtegida(contenedor, onLogout) {
  try {
    const datos = await api.get('/api/privado');
    contenedor.innerHTML = `
      <h2>Zona protegida</h2>
      <p>${datos.mensaje}</p>
      <button id="cerrarSesion">Cerrar sesión</button>
    `;
    document.getElementById('cerrarSesion').addEventListener('click', onLogout);
  } catch (e) {
    contenedor.innerHTML = '<p>Error de autenticación</p>';
  }
}
