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
import { calcularPruebaDatosPublicos } from '../utiles/utilesArbol.js';
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

  async cargarVotoEleccion(cuentaAddr, assetId) {
    try {
      const respRecibida = await servicioAlgorand.consultarPapeletaRecibida(cuentaAddr, assetId);
      const respEnviada = await servicioAlgorand.consultarPapeletaRecibida(cuentaAddr, assetId);

      return {
        datePape: respRecibida ? respRecibida.date : null,
        txIdPape: respRecibida ? respRecibida.txId : null,

        dateVoto: respEnviada ? respEnviada.date : null,
        txIdVoto: respEnviada ? respEnviada.txId : null,

        notaVoto: respEnviada && respEnviada.nota ? respEnviada.nota.voto : null
      }

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
          const datosCompromiso = await desencriptarDatosCompromiso(registro.compromisoPrivado, idEleccion);
          if (datosCompromiso) {
            registro.compromisoAddr = datosCompromiso.cuentaAddr;
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
          const votoEleccion = await this.cargarVotoEleccion(registro.compromisoAddr, registro.contratoAssetId);
          if (votoEleccion) {
            registro.papeDate = votoEleccion.datePape ? formatearFechaWeb(votoEleccion.datePape) : null;
            registro.papeTxId = votoEleccion.txIdPape;
            registro.votoDate = votoEleccion.dateVoto ? formatearFechaWeb(votoEleccion.dateVoto) : null;
            registro.votoTxId = votoEleccion.txIdVoto;
            registro.votoNota = votoEleccion.notaVoto;
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

  async solicitarPapeletaEleccion(idEleccion) {
    try {
      mostrarSpinnerOverlay('Solicitando papeleta, por favor espere...');

      let registro = await this.cargarRegistroEleccion(idEleccion);
      if (!registro) {
        throw new Error('Registro no encontrado para la elección: ' + idEleccion);
      }

      if (!registro.compromiso || !registro.compromisoPrivado) {
        throw new Error('No se ha registrado el compromiso para la elección: ' + idEleccion);
      }

      if (registro.papeDate) {
        throw new Error('Ya ha recibido la papeleta para la elección: ' + idEleccion);
      }

      const datosCompromiso = await desencriptarDatosCompromiso(registro.compromisoPrivado);
      if (!datosCompromiso) {
        throw new Error('No se pudieron desencriptar los datos del compromiso');
      }

      //--------------

      const { proof, publicInputs } = await calcularPruebaDatosPublicos(
        datosCompromiso.secreto,
        datosCompromiso.anulador,
        registro.compromisoBloqueIdx,
        registro.urlCircuito,
        registro.urlCompromisos);

      //--------------

      const bodyRegistrar = { 
        cuentaAddr: datosCompromiso.cuentaAddr, 
        proofBase64: btoa(String.fromCharCode(...proof)), 
        publicInputs 
      };

      const respRegistrar = await api.put(`/api/papeleta/${idEleccion}/registrar`, bodyRegistrar);
      if (!respRegistrar) {
        throw new Error('Error al registrar la papeleta en el servidor');
      } 
      console.log('Papeleta registrada:', respRegistrar);

      //--------------

      const balance = await servicioAlgorand.revisarBalance(datosCompromiso.cuentaAddr, registro.contratoAssetId);
      const tieneOptIn = await servicioAlgorand.revisarOptIn(datosCompromiso.cuentaAddr, registro.contratoAssetId);

      // console.log(`Balance: ${balance} microALGOs`);
      // console.log(tieneOptIn ? "Ya está opt-in" : "No ha hecho opt-in");

      if (balance > 100000 && !tieneOptIn) {
        console.log("Haciendo opt-in...");
        const txIdOptIn = await servicioAlgorand.hacerOptIn(datosCompromiso.mnemonico, registro.contratoAssetId);
        console.log("Opt-in realizado con txID:", txIdOptIn);
      } else {
        console.log("No es necesario hacer opt-in o ya se ha hecho.");
      }
 
      //--------------

      const bodySolicitar = { 
        anulador: datosCompromiso.anulador
      };

      const respSolicitar = await api.put(`/api/papeleta/${idEleccion}/solicitar`, bodySolicitar);
      if (!respSolicitar) {
        throw new Error('Error al solicitar la papeleta en el servidor');
      } 
      console.log('Papeleta solicitada:', respSolicitar);

      //--------------

      const votoEleccion = await this.cargarVotoEleccion(registro.compromisoAddr, registro.contratoAssetId);
      if (votoEleccion) {
        registro.papeDate = votoEleccion.datePape ? formatearFechaWeb(votoEleccion.datePape) : null;
        registro.papeTxId = votoEleccion.txIdPape;
        registro.votoDate = votoEleccion.dateVoto ? formatearFechaWeb(votoEleccion.dateVoto) : null;
        registro.votoTxId = votoEleccion.txIdVoto;
        registro.votoNota = votoEleccion.notaVoto;
      }

      return registro;

    } catch (error) {
      throw new Error('Error creado datos de registro: ' + error.message);

    } finally {
      ocultarSpinnerOverlay();
    }
  },
}

//------------------------------------------------------------------------------
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

  // console.log('Datos privados encriptados:', datosPrivados);
  // console.log('Datos privados desencriptados:', await desencriptarJSON(datosPrivados, servicioLogin.getClaveDerivada()));

  return { compromiso, datosPrivados };
}

async function desencriptarDatosCompromiso(datosPrivados) {

  let datosCompromiso = null;

  // TODO: sólo a desencriptarJSON con claveDerivada cuando se acaben las pruebas

  try {
    if (!datosCompromiso) {
      datosCompromiso = await desencriptarNodeJSON(datosPrivados, CLAVE_PRUEBAS);
    }
  } catch (error) {
    // console.error('Error desencriptando los datos del compromiso con Node:', error);
    datosCompromiso = null;
  }

  try {
    if (!datosCompromiso) {
      datosCompromiso = await desencriptarJSON(compromisoPrivado, servicioLogin.getClaveDerivada());
    }
  } catch (error) {
    console.error('Error desencriptando los datos del compromiso:', error);
    datosCompromiso = null;
  }

  return datosCompromiso;
}
