import { api } from './api.js';
import { contexto } from '../modelo/contexto.js';
import { validarDatos, esquemaVotante } from '../modelo/esquemas.js';
import { notificarAccesoIdentificado } from '../componentes/accesoServidor.js';
import { servicioAlgorand } from './servicioAlgorand.js';
import { servicioLogin } from '../servicios/servicioLogin.js';
import { encriptarJSON, desencriptarJSON, desencriptarNodeJSON } from '../utiles/utilesCrypto.js';
import { voto3IDB as idb } from '../modelo/voto3IDB.js';
import { calcularBloqueIndice } from '../utiles/utilesArbol.js';
import { servicioEleccion } from './servicioEleccion.js';

import { CLAVE_PRUEBAS } from '../utiles/constantes.js';


export const servicioVotante = {

  async cargarVotante() {
    try {
      const usuario = await idb.obtenerUsuario(contexto.getNombreUsuario());
      if (usuario && usuario.votante) {
        const votantePlano = await desencriptarJSON(usuario.votante, servicioLogin.getClaveDerivada());
        const nombreVotante = votantePlano.nombre + ' ' + votantePlano.primerApellido + ' ' + votantePlano.segundoApellido;
        contexto.actualizarContexto({ nombreVotante });
        return votantePlano;
      }
    } catch (error) {
      console.error('Error al cargar el votante desde IDB:', error);
    }
    return await this.cargarVotanteApi();
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
      const votantePlano = validarDatos(votanteApi, esquemaVotante);
      const nombreVotante = votantePlano.nombre + ' ' + votantePlano.primerApellido + ' ' + votantePlano.segundoApellido;
      contexto.actualizarContexto({ nombreVotante });
      const votante = await encriptarJSON(votantePlano, servicioLogin.getClaveDerivada());
      await idb.actualizarUsuario(contexto.getNombreUsuario(), { votante });
      return votantePlano;
    } catch (error) {
      throw new Error('Error al cargar los datos del censo: ' + error.message);
    }
  },

  // async cargarRegistroEleccion(idEleccion) {
  //   try {
  //     const registro = await idb.obtenerRegistro(contexto.getNombreUsuario(), idEleccion);
  //     if (registro) {
  //       return registro;
  //     }
  //   } catch (error) {
  //     console.error('Error al cargar el votante desde IDB:', error);
  //     return await this.cargarRegistroEleccionApi(idEleccion);
  //   }

  //   return await this.cargarRegistroEleccionApi(idEleccion);
  // },

  // async cargarRegistroEleccionApi(idEleccion) {
  //   try {
  //     const credenciales = await notificarAccesoIdentificado('Cargar datos registro');
  //     if (!credenciales) {
  //       console.warn('Operación cancelada por el usuario');
  //       return null;
  //     }
  //     const registroApi = await api.get(`/api/registro/${idEleccion}`, { credenciales });
  //     if (!registroApi) {
  //       console.log('No se encontraron datos de registro para la elección');
  //       return null;
  //     }
  //     console.log('Datos de registro recuperados:', registroApi);
  //     // const registro = validarDatos(registroApi, esquemaRegistroVotante);
  //     const { votanteId, eleccionId, ...registro } = registroApi;
  //     await idb.actualizarRegistro(contexto.getNombreUsuario(), idEleccion, registro);
  //     this.cargarDatosVotacion(idEleccion, registro.compromisoIdx);
  //     return await idb.obtenerRegistro(contexto.getNombreUsuario(), idEleccion);
  //   } catch (error) {
  //     throw new Error('Error al cargar los datos del registro: ' + error.message);
  //   }
  // },

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
        await idb.actualizarRegistro(nombreUsuario, idEleccion, contrato);
      }
      const prueba = await api.get(`/api/eleccion/${idEleccion}/pruebaZK`);
      if (prueba) {
        await idb.actualizarRegistro(nombreUsuario, idEleccion, prueba);
        const { bloque, bloqueIdx } = calcularBloqueIndice(prueba.tamBloque, prueba.tamResto, idxCompromiso);
        const raiz = await api.get(`/api/eleccion/${idEleccion}/raizZK/${bloque}`);
        if (raiz) await idb.actualizarRegistro(nombreUsuario, idEleccion, raiz);
      }
    } catch (error) {
      throw new Error('Error al cargar los datos de votación: ' + error.message);
    }
  },

  async cargarVotoEleccion(idEleccion) {
    try {
      console.log('Cargando voto de Algorand para la elección:', idEleccion);
      const eleccion = await this.cargarCompromiso(idEleccion);
      if (!eleccion || !eleccion.datosPrivados) {
        console.log('No se encontró el registro de la elección');
        return null;
      }
      console.log('Datos privados de la elección:', eleccion.datosPrivados);
      console.log('Clave derivada del usuario:', servicioLogin.getClaveDerivada());
      // TODO: cambiar a desencriptarJSON
      // const datosPrivados = await desencriptarJSON(eleccion.datosPrivados, servicioLogin.getClaveDerivada());
      const datosPrivados = await desencriptarNodeJSON(eleccion.datosPrivados, CLAVE_PRUEBAS);
      if (!datosPrivados) {
        console.log('No se obtuvieron los datos privados del usuario');
        return null;
      }
      console.log('Datos privados del usuario:', datosPrivados);

      const { txId, nota } = await servicioAlgorand.consultarPapeletaEnviada(datosPrivados.cuentaAddr, eleccion.tokenId);

      console.log('Voto cargado:', { txId, nota });
      return { txId, nota };

    } catch (error) {
      throw new Error('Error al cargar el voto de Algorand: ' + error.message);
    }
  },

  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------

  async cargarCompromiso(idEleccion) {
    try {
      const credenciales = await notificarAccesoIdentificado('Cargar datos registro');
      if (!credenciales) {
        console.warn('Operación cancelada por el usuario');
        return null;
      }
      const compromiso = await api.get(`/api/registro/${idEleccion}`, { credenciales });
      if (!compromiso) {
        console.log('No se encontraron datos de registro para la elección');
        return null;
      }
      console.log('Datos de compromiso recuperados:', compromiso);
      // return validarDatos(compromiso, esquemaRegistroVotante);
      return compromiso
    } catch (error) {
      throw new Error('Error al cargar los datos del registro: ' + error.message);
    }
  },

  //------------------------------------------------------------------------------

  async crearDatosRegistro(eleccion, contrato = null) {
    try {
      let registro = await idb.obtenerRegistro(contexto.getNombreUsuario(), eleccion.id);

      if (!registro) {

        registro = {};
        registro.nombreUsuario = eleccion.claveVotoPublica;
        registro.eleccionId = eleccion.id;
      }

      registro.claveVotoPublica = eleccion.claveVotoPublica;
      registro.claveVotoPrivada = eleccion.claveVotoPrivada;

      let contratoRegistro = contrato || await servicioEleccion.cargarContrato(eleccion.id);
      if (contratoRegistro) {

        registro.appId = contratoRegistro.appId;
        registro.appAddr = contratoRegistro.appAddr;
        registro.tokenId = contratoRegistro.tokenId;
      }

      const compromiso = await this.cargarCompromiso(eleccion.id);
      if (compromiso) {
        registro.compromiso = compromiso.compromiso; 
        registro.compromisoIdx = compromiso.compromisoIdx;
        registro.compromisoTxId = compromiso.compromisoTxId;
        registro.compromisoFecha = compromiso.fechaRegistro;
        registro.compromisoPrivado = compromiso.datosPrivados;
      } else {
        registro.compromiso = null;
      }

      const pruebaZK = servicioEleccion.cargarPruebaZK(eleccion.id);
      if (pruebaZK) {
        registro.numBloques = pruebaZK.numBloques;
        registro.tamBloque = pruebaZK.tamBloque;
        registro.tamResto = pruebaZK.tamResto;
        registro.txIdRaizInicial = pruebaZK.txIdRaizInicial;
        registro.urlCircuito = pruebaZK.urlCircuito;
        registro.ipfsCircuito = pruebaZK.ipfsCircuito;
      }

      if (compromiso && pruebaZK) {
        const { bloque, bloqueIdx } = calcularBloqueIndice(pruebaZK.tamBloque, pruebaZK.tamResto, compromiso.compromisoIdx);
        registro.bloque = bloque;
        registro.bloqueIdx = bloqueIdx; 
      }

      registro.idSesion = contexto.getIdSesion();
      await idb.crearRegistro(registro);

    } catch (error) {
      throw new Error('Error creado datos de registro: ' + error.message);
    }
  },

  //------------------------------------------------------------------------------

  async cargarDatosRegistro(idEleccion) {
    try {
      let registro = await idb.obtenerRegistro(contexto.getNombreUsuario(), idEleccion);

      if (!registro) {
        console.error('No se encontró el registro de la elección en IDB');
        return null;
      }

      registro.claveVotoPublica = eleccion.claveVotoPublica;
      registro.claveVotoPrivada = eleccion.claveVotoPrivada;

      let contratoRegistro = contrato || await servicioEleccion.cargarContrato(eleccion.id);
      if (contratoRegistro) {

        registro.appId = contratoRegistro.appId;
        registro.appAddr = contratoRegistro.appAddr;
        registro.tokenId = contratoRegistro.tokenId;
      }

      const compromiso = await this.cargarCompromiso(eleccion.id);
      if (compromiso) {
        registro.compromiso = compromiso.compromiso; 
        registro.compromisoIdx = compromiso.compromisoIdx;
        registro.compromisoTxId = compromiso.compromisoTxId;
        registro.compromisoFecha = compromiso.fechaRegistro;
        registro.compromisoPrivado = compromiso.datosPrivados;
      } else {
        registro.compromiso = null;
      }

      const pruebaZK = servicioEleccion.cargarPruebaZK(eleccion.id);
      if (pruebaZK) {
        registro.numBloques = pruebaZK.numBloques;
        registro.tamBloque = pruebaZK.tamBloque;
        registro.tamResto = pruebaZK.tamResto;
        registro.txIdRaizInicial = pruebaZK.txIdRaizInicial;
        registro.urlCircuito = pruebaZK.urlCircuito;
        registro.ipfsCircuito = pruebaZK.ipfsCircuito;
      }

      if (compromiso && pruebaZK) {
        const { bloque, bloqueIdx } = calcularBloqueIndice(pruebaZK.tamBloque, pruebaZK.tamResto, compromiso.compromisoIdx);
        registro.bloque = bloque;
        registro.bloqueIdx = bloqueIdx; 
      }

      registro.idSesion = contexto.getIdSesion();


      await idb.crearRegistro(registro);
      await idb.actualizarRegistro(contexto.getNombreUsuario(), eleccion.id, registro);

    } catch (error) {
      throw new Error('Error creado datos de registro: ' + error.message);
    }
  },

  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------


};