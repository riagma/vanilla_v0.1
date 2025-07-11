import { api } from './api.js';
import { contexto } from '../modelo/contexto.js';
import { validarDatos, esquemaVotante } from '../modelo/esquemas.js';
import { notificarAccesoIdentificado } from '../componentes/accesoServidor.js';
import { servicioAlgorand } from './servicioAlgorand.js';
import { servicioLogin } from '../servicios/servicioLogin.js';
import { desencriptar, encriptar } from '../utiles/utilesCrypto.js';
import { voto3IDB as idb } from '../modelo/voto3IDB.js';
import { calcularBloqueIndice } from '../utiles/utilesArbol.js';


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
      const { votanteId, eleccionId, ...registro } = registroApi;
      await idb.actualizarEleccion(contexto.getNombreUsuario(), idEleccion, registro);
      this.cargarDatosVotacion(idEleccion, registro.compromisoIdx);
      return await idb.obtenerEleccion(contexto.getNombreUsuario(), idEleccion);
    } catch (error) {
      throw new Error('Error al cargar los datos del censo: ' + error.message);
    }
  },

  async cargarDatosVotacion(idEleccion, idxCompromiso) {
    try {
      const nombreUsuario = contexto.getNombreUsuario();
      // const eleccion = await idb.obtenerEleccion(nombreUsuario, idEleccion);
      // if (!eleccion) {
      //   console.log('No se encontró el registro de la elección en IDB');
      //   return null;
      // }
      const contrato = await api.get(`/api/eleccion/${idEleccion}/contrato`);
      if (contrato) {
        await idb.actualizarEleccion(nombreUsuario, idEleccion, contrato);
      }
      const prueba = await api.get(`/api/eleccion/${idEleccion}/pruebaZK`);
      if (prueba) {
        await idb.actualizarEleccion(nombreUsuario, idEleccion, prueba);
        const { bloque, bloqueIdx } = calcularBloqueIndice(prueba.tamBloque, prueba.tamResto, idxCompromiso);
        const raiz = await api.get(`/api/eleccion/${idEleccion}/raizZK/${bloque}`);
        if (raiz) await idb.actualizarEleccion(nombreUsuario, idEleccion, raiz);
      }
    } catch (error) {
      throw new Error('Error al cargar los datos de votación: ' + error.message);
    }
  },

  async cargarVotoEleccion(idEleccion) {
    try {
      console.log('Cargando voto de Algorand para la elección:', idEleccion);
      const eleccion = await this.cargarRegistroEleccion(idEleccion);
      if (!eleccion || !eleccion.datosPrivados) {
        console.log('No se encontró el registro de la elección');
        return null;
      }
      console.log('Datos privados de la elección:', eleccion.datosPrivados);
      const datosPrivados = await desencriptar(eleccion.datosPrivados, servicioLogin.getClaveDerivada());
      if (!datosPrivados) {
        console.log('No se obtuvieron los datos privados del usuario');
        return null;
      }
      console.log('Datos privados del usuario:', datosPrivados);

      const { txId, nota } = servicioAlgorand.consultarPapeletaEnviada(datosPrivados.cuenta);

      console.log('Voto cargado:', { txId, nota });
      return { txId, nota };

    } catch (error) {
      throw new Error('Error al cargar el voto de Algorand:' + error.message);
    }
  },
};