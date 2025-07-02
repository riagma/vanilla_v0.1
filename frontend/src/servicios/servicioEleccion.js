import { api } from './api.js';
import { 
  validarDatos, 
  esquemaElecciones, 
  esquemaDetalleEleccion 
} from '../modelo/esquemas.js';

export const servicioEleccion = {
  async cargarElecciones() {
    try {
      const elecciones = await api.get('/api/eleccion/disponibles');
      return validarDatos(elecciones, esquemaElecciones);
    } catch (error) {
      throw new Error('Error al cargar elecciones: ' + error.message);
    }
  },

  async cargarDetalleEleccion(idEleccion) {
    try {
      const detalleEleccion = await api.get(`/api/votante/eleccion/${idEleccion}`);
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
        registroEleccion
      ] = await Promise.all([
        api.get(`/api/votante/eleccion/${idEleccion}`),
        api.get(`/api/votante/eleccion/${idEleccion}/partidos`),
        api.get(`/api/votante/eleccion/${idEleccion}/resultados`).catch(() => null),
        api.get(`/api/votante/eleccion/${idEleccion}/registro`).catch(() => null)
      ]);

      const detalle = {
        eleccion,
        partidos,
        resultados,
        registroEleccion
      };

      return validarDatos(detalle, esquemaDetalleEleccion);
    } catch (error) {
      throw new Error('Error al cargar detalle de elección: ' + error.message);
    }
  }
*/
};