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
    { type: 'uint64', name: 'bloques_zk' },
    { type: 'uint64', name: 'resto_zk' }
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
  args: [],
  returns: { type: 'void' },
});

//--------------

const ABIabrirRegistroAnuladores = new ABIMethod({
  name: 'abrir_registro_anuladores',
  args: [],
  returns: { type: 'void' },
});

const ABIcerrarRegistroAnuladores = new ABIMethod({
  name: 'cerrar_registro_anuladores',
  args: [],
  returns: { type: 'void' },
});

const ABIregistrarAnulador = new ABIMethod({
  name: 'registrar_anulador',
  args: [],
  returns: { type: 'void' },
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
  return { txId: resultado.txIds, idx: resultado.returns[0].returnValue };
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

export async function abrirRegistroRaices(bd, { contratoId, bloquesZK = 0, restoZK = 0 }) {
  const args = [bloquesZK, restoZK];
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
    lease: Uint8Array.from(randomBytes(32)),
    note: raiz,
  });
  return { txId: resultado.txIds[0], num: resultado.returns[0].returnValue };
}

//----------------------------------------------------------------------------

export async function cerrarRegistroRaices(bd, { contratoId }) {
  const resultado = await _llamarMetodoVoto3(bd, {
    contratoId,
    method: ABIcerrarRegistroRaices,
  });
  return { txId: resultado.txIds[0], confirmedRound: resultado.confirmation?.confirmedRound };
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

export async function registrarAnulador(bd, { contratoId, anulador }) {
  console.log("Registrando anulador:", anulador);
  const resultado = await _llamarMetodoVoto3(bd, {
    contratoId,
    method: ABIregistrarAnulador,
    lease: Uint8Array.from(randomBytes(32)),
    note: anulador,
  });
  return { txId: resultado.txIds[0], confirmedRound: resultado.confirmation?.confirmedRound };
}

//----------------------------------------------------------------------------

export async function cerrarRegistroAnuladores(bd, { contratoId }) {
  const resultado = await _llamarMetodoVoto3(bd, {
    contratoId,
    method: ABIcerrarRegistroAnuladores,
  });
  return { txId: resultado.txIds[0], confirmedRound: resultado.confirmation?.confirmedRound };
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
  }

  console.log(`sender: ${contratoSender}, appId: ${contratoAppId}`);

  return { sender: contratoSender, appId: contratoAppId }
}

//----------------------------------------------------------------------------

export async function leerContratoBaseDatos(bd, contratoId) {
  try {
    console.log(`Obtenido datos del contrato ${contratoId} ...`);
    const contratoBlockchain = await daos.contratoBlockchain.obtenerPorId(bd, { contratoId });
    console.log('Datos obtenidos con éxito: ', contratoBlockchain);
    return { appId: contratoBlockchain.appId, cuentaId: contratoBlockchain.cuentaId };
  } catch (error) {
    await bd.close();
    throw new Error('Error obtenido datos cuenta: ' + error.message);
  }
}

//----------------------------------------------------------------------------

export async function leerCuentaBaseDatos(bd, cuentaId) {
  try {
    console.log(`Obtenido datos cuenta ${cuentaId} algorand ...`);
    const cuentaBlockchain = await daos.cuentaBlockchain.obtenerPorId(bd, { cuentaId });

    console.log('Datos obtenidos con éxito: ', cuentaBlockchain);
    return {
      bd,
      secreto: cuentaBlockchain.accSecret,
    }

  } catch (error) {
    await bd.close();
    throw new Error('Error obtenido datos cuenta: ' + error.message);
  }
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
