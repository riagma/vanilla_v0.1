import { api } from './api.js';
import { 
  validarDatos, 
  esquemaElecciones, 
  esquemaDetalleEleccion 
} from '../tipos/esquemas.js';

export const servicioVotante = {
  async cargarElecciones() {
    try {
      const elecciones = await api.get('/api/votante/elecciones');
      return validarDatos(elecciones, esquemaElecciones);
    } catch (error) {
      throw new Error('Error al cargar elecciones: ' + error.message);
    }
  },

  async cargarDetalleEleccion(idEleccion) {
    try {
      const detalleEleccion = await api.get(`/api/votante/elecciones/${idEleccion}`);
      return validarDatos(detalleEleccion, esquemaDetalleEleccion);
    } catch (error) {
      throw new Error('Error al cargar detalle de elección: ' + error.message);
    }
  },
  
/** 
  async cargarDetalleEleccion(idEleccion) {
    try {
      const [
        eleccion,
        partidos,
        resultados,
        registroVotante
      ] = await Promise.all([
        api.get(`/api/votante/elecciones/${idEleccion}`),
        api.get(`/api/votante/elecciones/${idEleccion}/partidos`),
        api.get(`/api/votante/elecciones/${idEleccion}/resultados`).catch(() => null),
        api.get(`/api/votante/elecciones/${idEleccion}/registro`).catch(() => null)
      ]);

      const detalle = {
        eleccion,
        partidos,
        resultados,
        registroVotante
      };

      return validarDatos(detalle, esquemaDetalleEleccion);
    } catch (error) {
      throw new Error('Error al cargar detalle de elección: ' + error.message);
    }
  }
*/
};