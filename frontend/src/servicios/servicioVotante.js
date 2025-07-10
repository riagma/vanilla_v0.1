import { api } from './api.js';
import { contexto } from '../modelo/contexto.js';
import { validarDatos, esquemaVotante } from '../modelo/esquemas.js';
import { notificarAccesoIdentificado } from '../componentes/accesoServidor.js';
import { servicioAlgorand } from './servicioAlgorand.js';
import { servicioLogin } from '../servicios/servicioLogin.js';
import { desencriptar, encriptar } from '../utiles/utilesCrypto.js';
import { voto3IDB as idb } from '../modelo/voto3IDB.js';


export const servicioVotante = {

  async cargarVotante() {
    try {
      const usuario = await idb.obtenerVotante(contexto.getNombreUsuario());
      if (usuario && usuario.censo) {
        return await desencriptar(usuario.censo, servicioLogin.getClaveDerivada());
      }
      return await this.cargarVotanteApi();
    } catch (error) {
      console.error('Error al cargar el votante desde IDB:', error);
      return await this.cargarVotanteApi();
    }
  },

  async cargarVotanteApi() {
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

  async cargarRegistroEleccion(idEleccion) {
    try {
      const eleccion = await idb.obtenerEleccion(contexto.getNombreUsuario(), idEleccion);
      if (eleccion) {
        return eleccion;
      }
      return await this.cargarRegistroEleccionApi(idEleccion);
    } catch (error) {
      console.error('Error al cargar el votante desde IDB:', error);
      return await this.cargarRegistroEleccionApi(idEleccion);
    }
  },

  async cargarRegistroEleccionApi(idEleccion) {
    try {
      const credenciales = await notificarAccesoIdentificado('Cargar datos registro');
      if (!credenciales) {
        console.warn('Operación cancelada por el usuario');
        return null;
      }
      const registroApi = await api.get(`/api/registro/${idEleccion}`, { credenciales });
      if (!registroApi) {
        console.log('No se encontraron datos de registro para la elección');
        return null;
      }
      console.log('Datos de registro recuperados:', registroApi);
      // const registro = validarDatos(registroApi, esquemaRegistroVotante);
      const { votanteId, ...registro } = registroApi;
      await idb.actualizarVotante({ nombreUsuario: contexto.getNombreUsuario(), registro });
      return registro;
    } catch (error) {
      throw new Error('Error al cargar los datos del censo: ' + error.message);
    }
  },

  async cargarContratoEleccion(idEleccion) {
    try {
      const credenciales = await notificarAccesoIdentificado('Cargar datos registro');
      if (!credenciales) {
        console.warn('Operación cancelada por el usuario');
        return null;
      }
      const registroApi = await api.get(`/api/registro/${idEleccion}`, { credenciales });
      if (!registroApi) {
        console.log('No se encontraron datos de registro para la elección');
        return null;
      }
      console.log('Datos de registro recuperados:', registroApi);
      // const registro = validarDatos(registroApi, esquemaRegistroVotante);
      const { votanteId, ...registro } = registroApi;
      await idb.actualizarVotante({ nombreUsuario: contexto.getNombreUsuario(), registro });
      return registro;
    } catch (error) {
      throw new Error('Error al cargar los datos del censo: ' + error.message);
    }
  },

  async cargarVotoEleccion(idEleccion) {
    try {
      const eleccion = await this.cargarRegistroEleccion(idEleccion);
      if (!eleccion || !eleccion.datosPrivados) {
        console.log('No se encontró el registro de la elección');
        return null;
      }
      const datosPrivados = await desencriptar(eleccion.datosPrivados, servicioLogin.getClaveDerivada());
      if (!datosPrivados) {
        console.log('No se encontró el voto en los datos privados');
        return null;
      }

      const urlIndexer = `http://localhost:8980/v2/transactions?asset-id=${datosPrivados.assetId}&address=${datosPrivados.sender}&tx-type=axfer&limit=1`;

      const registroApi = await api.get(`/api/registro/${idEleccion}`, { credenciales });


      fetch(`http://localhost:8980/v2/transactions?asset-id=${assetId}&address=${sender}&tx-type=axfer&limit=1`)
        .then(res => res.json())
        .then(data => {
          const tx = data.transactions?.[0];
          if (tx) {
            console.log('Tx ID:', tx.id);
            console.log('Receptor:', tx['asset-transfer-transaction'].receiver);
            console.log('Cantidad:', tx['asset-transfer-transaction'].amount);
          } else {
            console.log('No se encontraron transacciones.');
          }
        });

      const usuario = await idb.obtenerVotante(contexto.getNombreUsuario());
      if (usuario && usuario.censo) {
        return await desencriptar(usuario.censo, servicioLogin.getClaveDerivada());
      }
      return await this.cargarVotanteApi();
    } catch (error) {
      console.error('Error al cargar el votante desde IDB:', error);
      return await this.cargarVotanteApi();
    }
  },


};