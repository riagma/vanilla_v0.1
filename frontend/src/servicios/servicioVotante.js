import { api } from './api.js';
import { contexto } from '../modelo/contexto.js';
import { validarDatos, esquemaVotante } from '../modelo/esquemas.js';
import { notificarAccesoIdentificado } from '../componentes/accesoServidor.js';
import { servicioAlgorand } from './servicioAlgorand.js';
import { servicioLogin } from '../servicios/servicioLogin.js';
import { voto3IDB as idb } from '../modelo/voto3IDB.js';
import { calcularBloqueIndice } from '../utiles/utilesArbol.js';
import { servicioEleccion } from './servicioEleccion.js';
import { CLAVE_PRUEBAS } from '../utiles/constantes.js';
import { formatearFechaWeb } from '../utiles/utilesFechas.js';
import { mostrarSpinnerOverlay, ocultarSpinnerOverlay } from '../componentes/SpinnerOverlay.js';


import {
  randomBigInt,
  calcularPoseidon2,
  encriptarJSON,
  desencriptarJSON,
  desencriptarNodeJSON
} from '../utiles/utilesCrypto.js';
import { fi, id } from 'zod/v4/locales';


export const servicioVotante = {

  //------------------------------------------------------------------------------

  async cargarVotante() {
    try {
      const usuario = await idb.obtenerUsuario(contexto.getNombreUsuario());
      if (!usuario) {
        throw new Error('Usuario no encontrado en IDB');
      }
      let votantePlano = null;
      if (usuario.votante) {
        votantePlano = await desencriptarJSON(usuario.votante, servicioLogin.getClaveDerivada());
      } else {
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
        votantePlano = validarDatos(votanteApi, esquemaVotante);
        const votante = await encriptarJSON(votantePlano, servicioLogin.getClaveDerivada());
        await idb.actualizarUsuario(contexto.getNombreUsuario(), { votante });
      }
      if (votantePlano) {
        contexto.actualizarContexto({
          nombreVotante:
            votantePlano.nombre + ' ' +
            votantePlano.primerApellido + ' ' +
            votantePlano.segundoApellido
        });
      }
      return votantePlano;
    } catch (error) {
      console.error('Error al cargar el votante desde IDB:', error);
    }
  },

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
      return compromiso;
    } catch (error) {
      throw new Error('Error al cargar los datos del registro: ' + error.message);
    }
  },

  //------------------------------------------------------------------------------

  async cargarPruebaZK(idEleccion) {
    try {
      const pruebaZK = await api.get(`/api/eleccion/${idEleccion}/pruebaZK`);
      if (!pruebaZK) {
        console.log('No se encontraron datos de las pruebas ZK para la elección');
        return null;
      }
      console.log('Datos de las pruebas ZK:', pruebaZK);
      // return validarDatos(compromiso, esquemaRegistroVotante);
      return pruebaZK;
    } catch (error) {
      throw new Error('Error al cargar los datos del registro: ' + error.message);
    }
  },

  //------------------------------------------------------------------------------

  async cargarRaizZK(idEleccion, bloque) {
    try {
      const raizZK = await api.get(`/api/eleccion/${idEleccion}/raizZK/${bloque}`);
      if (!raizZK) {
        console.log('No se encontraron datos de la raíz ZK para la elección');
        return null;
      }
      console.log('Datos de la raíz ZK:', raizZK);
      // return validarDatos(compromiso, esquemaRegistroVotante);
      return raizZK;
    } catch (error) {
      throw new Error('Error al cargar los datos del registro: ' + error.message);
    }
  },

  //------------------------------------------------------------------------------

  async cargarVotoEleccion(idEleccion, compromisoPrivado, assetId) {
    try {
      // TODO: cambiar a desencriptarJSON
      // const datosPrivados = await desencriptarJSON(compromisoPrivado, servicioLogin.getClaveDerivada());
      let compromisoDatos;
      if (idEleccion === 1) {
        compromisoDatos = await desencriptarNodeJSON(compromisoPrivado, CLAVE_PRUEBAS);
      } else {
        compromisoDatos = await desencriptarJSON(compromisoPrivado, servicioLogin.getClaveDerivada());
      }
      if (!compromisoDatos) {
        console.log('No se obtuvieron los datos privados del usuario');
        return null;
      }
      const cuentaAddr = compromisoDatos.cuentaAddr;
      console.log('Cuenta del compromiso del usuario:', cuentaAddr);

      return await servicioAlgorand.consultarPapeletaEnviada(cuentaAddr, assetId);

    } catch (error) {
      throw new Error('Error al cargar el voto de Algorand: ' + error.message);
    }
  },

  //------------------------------------------------------------------------------

  async cargarRegistroEleccion(idEleccion, eleccionParam = null, contratoParam = null) {
    try {
      let registro = await idb.obtenerRegistro(contexto.getNombreUsuario(), idEleccion);

      if (!registro) {

        registro = {};
        registro.nombreUsuario = contexto.getNombreUsuario();
        registro.eleccionId = idEleccion;
        registro.idSesion = "";

        await idb.crearRegistro(registro);
      }

      if (!registro.idSesion || registro.idSesion !== contexto.getIdSesion()) {

        registro.idSesion = contexto.getIdSesion();

        let eleccion = eleccionParam || await servicioEleccion.cargarEleccion(idEleccion);
        if (eleccion) {

          registro.claveVotoPublica = eleccion.claveVotoPublica;
          registro.claveVotoPrivada = eleccion.claveVotoPrivada;
        }

        let contrato = contratoParam || await servicioEleccion.cargarContrato(idEleccion);
        if (contrato) {

          registro.contratoAppId = contrato.appId;
          registro.contratoAppAddr = contrato.appAddr;
          registro.contratoAssetId = contrato.tokenId;
        }

        const compromiso = await this.cargarCompromiso(idEleccion);
        if (compromiso) {
          registro.compromiso = compromiso.compromiso;
          registro.compromisoIdx = compromiso.compromisoIdx;
          registro.compromisoTxId = compromiso.compromisoTxId;
          registro.compromisoFecha = formatearFechaWeb(compromiso.fechaRegistro);
          registro.compromisoPrivado = compromiso.datosPrivados;
        } else {
          registro.compromiso = null;
          registro.compromisoIdx = null;
          registro.compromisoTxId = null;
          registro.compromisoFecha = null;
          registro.compromisoPrivado = null;
        }

        if (registro.compromisoPrivado) {
          // TODO: cambiar a desencriptarJSON con claveDerivada
          if (idEleccion === 1) {
            const compromisoPrivado = await desencriptarNodeJSON(registro.compromisoPrivado, CLAVE_PRUEBAS);
            if (compromisoPrivado) {
              registro.compromisoAddr = compromisoPrivado.cuentaAddr;
            }
          } else {
            const compromisoPrivado = await desencriptarJSON(registro.compromisoPrivado, servicioLogin.getClaveDerivada());
            if (compromisoPrivado) {
              registro.compromisoAddr = compromisoPrivado.cuentaAddr;
            }
          }
        }

        if (registro.compromisoIdx != null) {
          const pruebaZK = await this.cargarPruebaZK(idEleccion);
          if (pruebaZK) {
            registro.urlCircuito = pruebaZK.urlCircuito;
            registro.ipfsCircuito = pruebaZK.ipfsCircuito;
            const { bloque, bloqueIdx } = calcularBloqueIndice(pruebaZK.tamBloque, pruebaZK.tamResto, registro.compromisoIdx);
            registro.compromisoBloque = bloque;
            registro.compromisoBloqueIdx = bloqueIdx;
          }
        }

        if (registro.compromisoBloque != null) {
          const raizZK = await this.cargarRaizZK(idEleccion, registro.compromisoBloque);
          if (raizZK) {
            registro.compromisoRaiz = raizZK.raiz;
            registro.compromisoRaizTxId = raizZK.txIdRaiz;
            registro.urlCompromisos = raizZK.urlCompromisos;
            registro.ipfsCompromisos = raizZK.ipfsCompromisos;
          }
        }

        if (registro.compromisoPrivado && registro.contratoAssetId) {
          const votoEleccion = await this.cargarVotoEleccion(idEleccion, registro.compromisoPrivado, registro.contratoAssetId);
          if (votoEleccion) {
            registro.votoTxId = votoEleccion.txId;
            registro.votoNota = votoEleccion.nota?.voto;
          }
        }

        await idb.actualizarRegistro(contexto.getNombreUsuario(), idEleccion, registro);
      }

      return registro;

    } catch (error) {
      throw new Error('Error creado datos de registro: ' + error.message);
    }
  },

  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------

  async crearCompromiso(idEleccion, compromiso, datosPrivados) {
    try {
      const credenciales = await notificarAccesoIdentificado('Registrarse en la elección');
      if (!credenciales) {
        console.warn('Operación cancelada por el usuario');
        return null;
      }

      // await new Promise(resolve => setTimeout(resolve, 2000));
      // return null; // TODO Simulación de espera para pruebas

      mostrarSpinnerOverlay('Registrando, por favor espere...');
      const body = { compromiso, datosPrivados };
      const compromisoCreado = await api.put(`/api/registro/${idEleccion}`, body, { credenciales });
      if (!compromisoCreado) {
        console.log('No se encontraron datos de registro para la elección');
        return null;
      }
      console.log('Datos de compromiso recuperados:', compromisoCreado);
      // return validarDatos(compromiso, esquemaRegistroVotante);
      return compromisoCreado;
    } catch (error) {
      throw new Error('Error al cargar los datos del registro: ' + error.message);
    } finally {
      ocultarSpinnerOverlay();
    }
  },

  //------------------------------------------------------------------------------

  async registrarVotanteEleccion(idEleccion) {
    try {
      let registro = await this.cargarRegistroEleccion(idEleccion);
      if (!registro) {
        throw new Error('Registro no encontrado para la elección: ' + idEleccion);
      }

      const { compromiso, datosPrivados } = await generarDatosCompromiso();

      const registroCompromiso = await this.crearCompromiso(idEleccion, compromiso, datosPrivados);
      if (registroCompromiso) {
        registro.compromiso = registroCompromiso.compromiso;
        registro.compromisoIdx = registroCompromiso.compromisoIdx;
        registro.compromisoTxId = registroCompromiso.compromisoTxId;
        registro.compromisoFecha = formatearFechaWeb(registroCompromiso.fechaRegistro);
        registro.compromisoPrivado = registroCompromiso.datosPrivados;

        if (registro.compromisoIdx != null) {
          const pruebaZK = await this.cargarPruebaZK(idEleccion);
          if (pruebaZK) {
            registro.urlCircuito = pruebaZK.urlCircuito;
            registro.ipfsCircuito = pruebaZK.ipfsCircuito;
            const { bloque, bloqueIdx } = calcularBloqueIndice(pruebaZK.tamBloque, pruebaZK.tamResto, registro.compromisoIdx);
            registro.compromisoBloque = bloque;
            registro.compromisoBloqueIdx = bloqueIdx;
          }
        }

        if (registro.compromisoBloque != null) {
          const raizZK = await this.cargarRaizZK(idEleccion, registro.compromisoBloque);
          if (raizZK) {
            registro.compromisoRaiz = raizZK.raiz;
            registro.compromisoRaizTxId = raizZK.txIdRaiz;
            registro.urlCompromisos = raizZK.urlCompromisos;
            registro.ipfsCompromisos = raizZK.ipfsCompromisos;
          }
        }

        await idb.actualizarRegistro(contexto.getNombreUsuario(), idEleccion, registro);
      }

      return registro;

    } catch (error) {
      throw new Error('Error creado datos de registro: ' + error.message);
    }
  },

  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------

  // async cargarVotanteApi() {
  //   try {
  //     const credenciales = await notificarAccesoIdentificado('Verificar datos censales');
  //     if (!credenciales) {
  //       console.warn('Operación cancelada por el usuario');
  //       return null;
  //     }
  //     const votanteApi = await api.get('/api/votante', { credenciales });
  //     if (!votanteApi) {
  //       console.log('No se encontraron datos censales para el votante');
  //       return null;
  //     }
  //     console.log('Datos censales recuperados:', votanteApi);
  //     const votantePlano = validarDatos(votanteApi, esquemaVotante);
  //     const nombreVotante = votantePlano.nombre + ' ' + votantePlano.primerApellido + ' ' + votantePlano.segundoApellido;
  //     contexto.actualizarContexto({ nombreVotante });
  //     const votante = await encriptarJSON(votantePlano, servicioLogin.getClaveDerivada());
  //     await idb.actualizarUsuario(contexto.getNombreUsuario(), { votante });
  //     return votantePlano;
  //   } catch (error) {
  //     throw new Error('Error al cargar los datos del censo: ' + error.message);
  //   }
  // },

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

  // async cargarDatosVotacion(idEleccion, idxCompromiso) {
  //   try {
  //     const nombreUsuario = contexto.getNombreUsuario();
  //     // const eleccion = await idb.obtenerEleccion(nombreUsuario, idEleccion);
  //     // if (!eleccion) {
  //     //   console.log('No se encontró el registro de la elección en IDB');
  //     //   return null;
  //     // }
  //     const contrato = await api.get(`/api/eleccion/${idEleccion}/contrato`);
  //     if (contrato) {
  //       await idb.actualizarRegistro(nombreUsuario, idEleccion, contrato);
  //     }
  //     const prueba = await api.get(`/api/eleccion/${idEleccion}/pruebaZK`);
  //     if (prueba) {
  //       await idb.actualizarRegistro(nombreUsuario, idEleccion, prueba);
  //       const { bloque, bloqueIdx } = calcularBloqueIndice(prueba.tamBloque, prueba.tamResto, idxCompromiso);
  //       const raiz = await api.get(`/api/eleccion/${idEleccion}/raizZK/${bloque}`);
  //       if (raiz) await idb.actualizarRegistro(nombreUsuario, idEleccion, raiz);
  //     }
  //   } catch (error) {
  //     throw new Error('Error al cargar los datos de votación: ' + error.message);
  //   }
  // },

  // async cargarVotoEleccion(idEleccion) {
  //   try {
  //     console.log('Cargando voto de Algorand para la elección:', idEleccion);
  //     const eleccion = await this.cargarCompromiso(idEleccion);
  //     if (!eleccion || !eleccion.datosPrivados) {
  //       console.log('No se encontró el registro de la elección');
  //       return null;
  //     }
  //     console.log('Datos privados de la elección:', eleccion.datosPrivados);
  //     console.log('Clave derivada del usuario:', servicioLogin.getClaveDerivada());
  //     // TODO: cambiar a desencriptarJSON
  //     // const datosPrivados = await desencriptarJSON(eleccion.datosPrivados, servicioLogin.getClaveDerivada());
  //     const datosPrivados = await desencriptarNodeJSON(eleccion.datosPrivados, CLAVE_PRUEBAS);
  //     if (!datosPrivados) {
  //       console.log('No se obtuvieron los datos privados del usuario');
  //       return null;
  //     }
  //     console.log('Datos privados del usuario:', datosPrivados);

  //     const { txId, nota } = await servicioAlgorand.consultarPapeletaEnviada(datosPrivados.cuentaAddr, eleccion.tokenId);

  //     console.log('Voto cargado:', { txId, nota });
  //     return { txId, nota };

  //   } catch (error) {
  //     throw new Error('Error al cargar el voto de Algorand: ' + error.message);
  //   }
  // },

};

//------------------------------------------------------------------------------

async function generarDatosCompromiso() {

  const { cuentaAddr, mnemonico } = servicioAlgorand.crearCuentaAleatoria();

  const secreto = randomBigInt();
  const anulador = randomBigInt();

  const compromiso = calcularPoseidon2([secreto, anulador]).toString();

  const datosPublicos = {
    cuentaAddr,
    mnemonico,
    secreto: secreto.toString(),
    anulador: anulador.toString(),
  };

  const datosPrivados = await encriptarJSON(datosPublicos, servicioLogin.getClaveDerivada());

  console.log('Datos privados encriptados:', datosPrivados);
  console.log('Datos privados desencriptados:', await desencriptarJSON(datosPrivados, servicioLogin.getClaveDerivada()));

  return { compromiso, datosPrivados };
}
