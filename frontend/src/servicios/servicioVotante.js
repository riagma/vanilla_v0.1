import { api } from './api.js';
import { contexto } from '../modelo/contexto.js';
import { validarDatos, esquemaVotante } from '../modelo/esquemas.js';
import { notificarAccesoIdentificado } from '../componentes/accesoServidor.js';
import { servicioLogin } from '../servicios/servicioLogin.js';
import { encriptar } from '../utiles/utilesCrypto.js';
import { voto3IDB as idb } from '../modelo/voto3IDB.js';


export const servicioVotante = {
  async recuperarDatosCensales() {
    try {
      const credenciales = await notificarAccesoIdentificado('Verificar datos censales'); 
      if (!credenciales) {
        console.warn('Operación cancelada por el usuario');
        return null; 
      }
      const votanteApi = await api.get('/api/votante', { credenciales });
      if (!votanteApi) {
        console.log('No se encontraron datos censales para el votante');
        return null;
      }
      console.log('Datos censales recuperados:', votanteApi);
      const votante = validarDatos(votanteApi, esquemaVotante);
      contexto.actualizarContexto({ nombreVotante: votante.nombre });
      const censo = await encriptar(votante, servicioLogin.getClaveDerivada());
      await idb.actualizarVotante({ nombreUsuario: contexto.getNombreUsuario(), censo });
      return votante;
    } catch (error) {
      throw new Error('Error al cargar los datos del censo: ' + error.message);
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