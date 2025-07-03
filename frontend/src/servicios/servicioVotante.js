import { api } from './api.js';
import { validarDatos, esquemaVotante } from '../modelo/esquemas.js';
import { notificarAccesoIdentificado } from '../componentes/accesoServidor.js';

export const servicioVotante = {
  async recuperarDatosCensales() {
    try {
      const credenciales = await notificarAccesoIdentificado('Verificar datos censales'); 
      if (!credenciales) {
        console.warn('Operación cancelada por el usuario');
        return null; // O lanzar un error si prefieres
      }
      const votante = await api.get('/api/votante', { credenciales });
      console.log('Datos censales recuperados:', votante);
      return validarDatos(votante, esquemaVotante);
    } catch (error) {
      throw new Error('Error al cargar elecciones: ' + error.message);
    }
  },

  // async cargarElecciones() {
  //   try {
  //     const elecciones = await api.get('/api/votante/eleccion');
  //     return validarDatos(elecciones, esquemaElecciones);
  //   } catch (error) {
  //     throw new Error('Error al cargar elecciones: ' + error.message);
  //   }
  // },

  // async cargarDetalleEleccion(idEleccion) {
  //   try {
  //     const detalleEleccion = await api.get(`/api/votante/eleccion/${idEleccion}`);
  //     return validarDatos(detalleEleccion, esquemaDetalleEleccion);
  //   } catch (error) {
  //     throw new Error('Error al cargar detalle de elección: ' + error.message);
  //   }
  // },
  
/** 
  async cargarDetalleEleccion(idEleccion) {
    try {
      const [
        eleccion,
        partidos,
        resultados,
        registroVotante
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
        registroVotante
      };

      return validarDatos(detalle, esquemaDetalleEleccion);
    } catch (error) {
      throw new Error('Error al cargar detalle de elección: ' + error.message);
    }
  }
*/
};