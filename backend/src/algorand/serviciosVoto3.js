import { microAlgos } from '@algorandfoundation/algokit-utils';

import { randomBytes } from 'node:crypto';
import { ABIMethod } from 'algosdk';
import { algorand } from './algorand.js';
import { daos } from '../bd/DAOs.js';

import { toNote } from './algoUtiles.js';

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

const ABIinicializarEleccion = new ABIMethod({
  name: 'inicializar_eleccion',
  args: [
    { type: 'string', name: 'asset_name' },
    { type: 'string', name: 'unit_name' },
    { type: 'uint64', name: 'total' }
  ],
  returns: { type: 'uint64' },
});

const ABIleerEstadoContrato = new ABIMethod({
  name: 'leer_estado_contrato',
  args: [],
  returns: { type: 'uint64' },
});

const ABIestablecerEstadoContrato = new ABIMethod({
  name: 'establecer_estado_contrato',
  args: [
    { type: 'uint64', name: 'nuevo_estado' }
  ],
  returns: { type: 'uint64' },
});

//--------------

const ABIabrirRegistroCompromisos = new ABIMethod({
  name: 'abrir_registro_compromisos',
  args: [],
  returns: { type: 'void' },
});

const ABIregistrarCompromiso = new ABIMethod({
  name: 'registrar_compromiso',
  args: [],
  returns: { type: 'uint64' },
});

const ABIcerrarRegistroCompromisos = new ABIMethod({
  name: 'cerrar_registro_compromisos',
  args: [],
  returns: { type: 'uint64' },
});

//--------------

const ABIabrirRegistroRaices = new ABIMethod({
  name: 'abrir_registro_raices',
  args: [
    { type: 'uint64', name: 'num_bloques' },
    { type: 'uint64', name: 'tam_bloque' },
    { type: 'uint64', name: 'tam_resto' }
  ],
  returns: { type: 'void' },
});

const ABIregistrarRaiz = new ABIMethod({
  name: 'registrar_raiz',
  args: [],
  returns: { type: 'uint64' },
});

const ABIcerrarRegistroRaices = new ABIMethod({
  name: 'cerrar_registro_raices',
  args: [{ type: 'String', name: 'txnId_raiz' }],
  returns: { type: 'uint64' },
});

const ABIleerDatosRaices = new ABIMethod({
  name: 'cerrar_registro_raices',
  args: [],
  returns: { type: 'uint64', type: 'uint64', type: 'uint64', type: 'String' },
});

//--------------

const ABIabrirRegistroAnuladores = new ABIMethod({
  name: 'abrir_registro_anuladores',
  args: [],
  returns: { type: 'void' },
});

const ABIregistrarAnulador = new ABIMethod({
  name: 'registrar_anulador',
  args: [],
  returns: { type: 'uint64' },
});

const ABIenviarPapeleta = new ABIMethod({
  name: 'enviar_papeleta',
  args: [{ type: 'address', name: 'destinatario' }],
  returns: { type: 'uint64' },
});

const ABIcerrarRegistroAnuladores = new ABIMethod({
  name: 'cerrar_registro_anuladores',
  args: [],
  returns: { type: 'uint64' },
});

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

let contadorNote = 0;

async function _llamarMetodoVoto3(bd, { contratoId, method, args = [], note, lease, extraFee }) {
  console.log(`Ejecutando llamada al método ${method.name}`);
  const { sender, appId } = await establecerClienteVoto3(bd, { contratoId });
  const params = {
    sender,
    appId,
    method,
    args,
    skipWaiting: false,
    skipSimulate: true,
    maxRoundsToWaitForConfirmation: 12,
    maxFee: microAlgos((extraFee ?? 0) + 2000),
    debug: false,
  };
  params.note = note ? toNote(note) : toNote(`voto3-${method.name}-${++contadorNote}`);
  if (lease) params.lease = lease;
  if (extraFee) params.extraFee = extraFee;
  const resultado = await algorand.send.appCallMethodCall(params);
  console.log(`Llamada ejecutada con éxito ${resultado.confirmation?.confirmedRound} - ${resultado.txIds}`);
  return resultado;
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

export async function inicializarEleccion(bd,
  {
    contratoId,
    nombreToken,
    nombreUnidades,
    numeroUnidades,
  }) {

  const assetName = nombreToken.length > 32 ? nombreToken.substring(0, 32) : nombreToken;
  const unitName = nombreUnidades.length > 8 ? nombreUnidades.substring(0, 8) : nombreUnidades;
  const total = BigInt(numeroUnidades);

  const args = [assetName, unitName, total];

  const resultado = await _llamarMetodoVoto3(bd, {
    contratoId,
    method: ABIinicializarEleccion,
    args,
    extraFee: (100000).microAlgos(),
  });
  return resultado.returns[0];
}

//----------------------------------------------------------------------------

export async function leerEstadoContrato(bd, { contratoId }) {
  const resultado = await _llamarMetodoVoto3(bd, {
    contratoId,
    method: ABIleerEstadoContrato,
  });
  return resultado.returns[0].returnValue;
}

//----------------------------------------------------------------------------

export async function establecerEstadoContrato(bd, { contratoId, estado }) {
  const args = [BigInt(estado)];
  const resultado = await _llamarMetodoVoto3(bd, {
    contratoId,
    method: ABIleerEstadoContrato,
    args,
  });
  return resultado.returns[0].returnValue;
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

export async function abrirRegistroCompromisos(bd, { contratoId }) {
  const resultado = await _llamarMetodoVoto3(bd, {
    contratoId,
    method: ABIabrirRegistroCompromisos,
  });
  return { txId: resultado.txIds, confirmedRound: resultado.confirmation?.confirmedRound };
}

//----------------------------------------------------------------------------

export async function registrarCompromiso(bd, { contratoId, compromiso }) {
  console.log("Registrando compromiso:", compromiso);
  const resultado = await _llamarMetodoVoto3(bd, {
    contratoId,
    method: ABIregistrarCompromiso,
    note: compromiso,
  });
  return { txId: resultado.txIds, num: resultado.returns[0].returnValue };
}

//----------------------------------------------------------------------------

export async function cerrarRegistroCompromisos(bd, { contratoId }) {
  const resultado = await _llamarMetodoVoto3(bd, {
    contratoId,
    method: ABIcerrarRegistroCompromisos,
  });
  return { txId: resultado.txIds, confirmedRound: resultado.confirmation?.confirmedRound };
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

export async function abrirRegistroRaices(bd, { contratoId, numBloques, tamBloque, tamResto }) {
  const args = [numBloques, tamBloque, tamResto];
  const resultado = await _llamarMetodoVoto3(bd, {
    contratoId,
    method: ABIabrirRegistroRaices,
    args,
  });
  return { txId: resultado.txIds[0], confirmedRound: resultado.confirmation?.confirmedRound };
}

//----------------------------------------------------------------------------

export async function registrarRaiz(bd, { contratoId, raiz }) {
  console.log("Registrando raíz:", raiz);
  const resultado = await _llamarMetodoVoto3(bd, {
    contratoId,
    method: ABIregistrarRaiz,
    // lease: Uint8Array.from(randomBytes(32)),
    note: raiz,
  });
  return { txId: resultado.txIds[0], num: resultado.returns[0].returnValue };
}

//----------------------------------------------------------------------------

export async function cerrarRegistroRaices(bd, { contratoId, txIdRaizInicial }) {
  const resultado = await _llamarMetodoVoto3(bd, {
    contratoId,
    method: ABIcerrarRegistroRaices,
  });
  return { txId: resultado.txIds[0], confirmedRound: resultado.confirmation?.confirmedRound };
}

//----------------------------------------------------------------------------

export async function leerDatosRaices(bd, { contratoId }) {
  const resultado = await _llamarMetodoVoto3(bd, {
    contratoId,
    method: ABIleerDatosRaices,
  });
  return {
    txId: resultado.txIds[0],
    confirmedRound: resultado.confirmation?.confirmedRound,
    numBloques: resultado.returns[0].returnValue,
    tamBloque: resultado.returns[1].returnValue,
    tamResto: resultado.returns[2].returnValue,
    txnIdRaiz: resultado.returns[3].returnValue
  };
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

export async function abrirRegistroAnuladores(bd, { contratoId }) {
  const resultado = await _llamarMetodoVoto3(bd, {
    contratoId,
    method: ABIabrirRegistroAnuladores,
  });
  return { txId: resultado.txIds[0], confirmedRound: resultado.confirmation?.confirmedRound };
}

//----------------------------------------------------------------------------

export async function registrarAnulador(bd, { contratoId, anulador, destinatario }) {
  console.log("Registrando anulador:", anulador);

  const { sender, appId } = await establecerClienteVoto3(bd, { contratoId });

  const txGroup = algorand
    .newGroup()
    .addPayment({ sender: sender, receiver: destinatario, amount: (205000).microAlgo() })
    .addAppCallMethodCall({
      sender,
      appId,
      method: ABIregistrarAnulador,
      maxFee: (2000).microAlgo(),
      note: toNote({
        anu: anulador,
        des: destinatario
      }),
    });

  const resultado = await txGroup.send({
    skipSimulate: true,
    skipWaiting: false,
    maxRoundsToWaitForConfirmation: 12,
  });

  return { txId: resultado.txIds[1], num: resultado.returns[1].returnValue };
}

//----------------------------------------------------------------------------

export async function enviarPapeleta(bd, { contratoId, destinatario }) {
  console.log("Enviando papeleta a:", destinatario);
  const resultado = await _llamarMetodoVoto3(bd, {
    contratoId,
    method: ABIenviarPapeleta,
    args: [destinatario]
  });
  return { txId: resultado.txIds[0], num: resultado.returns[0].returnValue };
}

//----------------------------------------------------------------------------

export async function cerrarRegistroAnuladores(bd, { contratoId }) {
  const resultado = await _llamarMetodoVoto3(bd, {
    contratoId,
    method: ABIcerrarRegistroAnuladores,
  });
  return { txId: resultado.txIds[0], num: resultado.returns[0].returnValue };
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

let contratoVoto3 = 0;

let contratoAppId = null;
let contratoSender = null;

export async function establecerClienteVoto3(bd, { contratoId }) {

  if (contratoId !== contratoVoto3) {

    contratoVoto3 = contratoId;

    const { appId, cuentaId } = await leerContratoBaseDatos(bd, contratoId);
    const { secreto } = await leerCuentaBaseDatos(bd, cuentaId);

    const cuentaContrato = algorand.account.fromMnemonic(secreto);

    algorand.setSigner(cuentaContrato.addr, cuentaContrato.signer);

    contratoAppId = BigInt(appId);
    contratoSender = cuentaContrato.addr;

    console.log(`sender: ${contratoSender}, appId: ${contratoAppId}`);
  }

  return { sender: contratoSender, appId: contratoAppId }
}

//----------------------------------------------------------------------------

export async function leerContratoBaseDatos(bd, contratoId) {
  try {
    const contrato = await daos.contratoBlockchain.obtenerPorId(bd, { contratoId });
    if (!contrato) {
      throw new Error(`No se ha encontrado el contrato con ID ${contratoId}`);
    }
    return { appId: contrato.appId, cuentaId: contrato.cuentaId };
  } catch (error) {
    throw new Error('Error obtenido datos cuenta: ' + error.message);
  }
}

//----------------------------------------------------------------------------

export async function leerCuentaBaseDatos(bd, cuentaId) {
  try {
    const cuenta = await daos.cuentaBlockchain.obtenerPorId(bd, { cuentaId });
    if (!cuenta) {
      throw new Error(`No se ha encontrado la cuenta con ID ${cuentaId}`);
    }
    return { secreto: cuenta.accSecret }
  } catch (error) {
    throw new Error('Error obtenido datos cuenta: ' + error.message);
  }
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
