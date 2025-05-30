import { api } from './api.js';

export const servicioVotante = {
  async cargarElecciones() {
    try {
      const elecciones = await api.get('/api/votante/elecciones');
      return elecciones;
    } catch (error) {
      throw new Error('Error al cargar elecciones: ' + error.message);
    }
  }
};