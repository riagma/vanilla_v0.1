import { api } from './api.js';
import { TIPO_USUARIO } from '../utiles/constantes.js';
import { actualizarContexto, limpiarContexto } from '../contexto.js';

export const servicioLogin = {
  async loginAdmin(correo, contrasena) {
    try {
      const { token, administrador } = await api.post('/api/login/admin', {
        correo,
        contrasena
      });

      actualizarContexto({
        token,
        tipoUsuario: TIPO_USUARIO.ADMIN,
        usuario: { nombre: administrador.correo },
        datosAdmin: administrador,
        datosVotante: null
      });

      // Limpia la URL de cualquier query string sensible
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);

    } catch (error) {
      throw new Error('Error en login de administrador: ' + error.message);
    }
  },

  async loginVotante(dni, contrasena) {
    try {
      const { token, votante } = await api.post('/api/login/votante', {
        dni,
        contrasena
      });

      actualizarContexto({
        token,
        tipoUsuario: TIPO_USUARIO.VOTANTE,
        usuario: votante,
        datosAdmin: null,
        datosVotante: votante
      });

      // Limpia la URL de cualquier query string sensible
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);

    } catch (error) {
      throw new Error('Error en login de votante: ' + error.message);
    }
  },

  logout() {
    limpiarContexto();
  }
};