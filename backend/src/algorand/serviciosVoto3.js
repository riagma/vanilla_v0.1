import { algorand, algod } from './algorand.js';
import { ABIMethod } from 'algosdk';
import { Voto3Client } from './voto3.js';
import { daos } from '../bd/daos.js';


import { randomBytes } from 'node:crypto';

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

const ABIinicializarEleccion = new ABIMethod({
  name: 'inicializar_eleccion',
  args: [],
  returns: { type: 'void' },
});

//--------------

const ABIabrirRegistroCompromisos = new ABIMethod({
  name: 'abrir_registro_compromisos',
  args: [],
  returns: { type: 'void' },
});

const ABIcerrarRegistroCompromisos = new ABIMethod({
  name: 'cerrar_registro_compromisos',
  args: [],
  returns: { type: 'void' },
});

const ABIregistrarCompromiso = new ABIMethod({
  name: 'registrar_compromiso',
  args: [],
  returns: { type: 'void' },
});

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

export async function inicializarEleccion(bd, { contratoId, args = [] }) {
  const { sender, appId } = establecerClienteVoto3(bd, { contratoId });
  const { txId, confirmation } = await algorand.send.appCallMethodCall({
    sender,
    appId,
    method: ABIinicializarEleccion,
    args,
    skipWaiting: false,
    skipSimulate: true,
    maxRoundsToWaitForConfirmation: 12,
    maxFee: (2000).microAlgos(),
    extraFee: (1000).microAlgos(),
  });
  console.log(`Elección inicializada en la ronda ${confirmation?.confirmedRound}`);
  return { txId, confirmedRound: confirmation?.confirmedRound ?? 0n };
}

//----------------------------------------------------------------------------

export async function abrirRegistroCompromisos(bd, { contratoId }) {
  const { sender, appId } = await establecerClienteVoto3(bd, { contratoId });
  console.log(`Abriendo registro compromisos ${appId}`);
  const { txId, confirmation } = await algorand.send.appCallMethodCall({
    sender,
    appId,
    method: ABIabrirRegistroCompromisos,
    args: [],
    lease: Uint8Array.from(randomBytes(32)),
    skipWaiting: false,
    skipSimulate: true,
    maxRoundsToWaitForConfirmation: 12,
    maxFee: (2000).microAlgos(),
  });
  console.log(`Abierto registro de compromisos en la ronda ${confirmation?.confirmedRound}`);
  return { txId, confirmedRound: confirmation?.confirmedRound ?? 0n };
}

//----------------------------------------------------------------------------

export async function registrarCompromiso(bd, { contratoId, compromiso }) {
  const { sender, appId } = await establecerClienteVoto3(bd, { contratoId });
  console.log("Registrando compromiso:", compromiso);
  const { txId, confirmation } = await algorand.send.appCallMethodCall({
    sender,
    appId,
    method: ABIregistrarCompromiso,
    args: [],
    lease: Uint8Array.from(randomBytes(32)),
    skipWaiting: false,
    skipSimulate: true,
    maxRoundsToWaitForConfirmation: 12,
    maxFee: (2000).microAlgos(),
    note: compromiso
  });
  console.log(`Compromiso registrado en la ronda ${confirmation?.confirmedRound}`);
  return { txId, confirmedRound: confirmation?.confirmedRound ?? 0n };
}

//----------------------------------------------------------------------------

export async function cerrarRegistroCompromisos(bd, { contratoId }) {
  const { sender, appId } = await establecerClienteVoto3(bd, { contratoId });
  console.log("Cerrando registro compromisos");
  const { txId, confirmation } = await algorand.send.appCallMethodCall({
    sender,
    appId,
    method: ABIabrirRegistroCompromisos,
    args: [],
    // lease: Uint8Array.from(randomBytes(32)),
    skipWaiting: false,
    skipSimulate: true,
    maxRoundsToWaitForConfirmation: 12,
    maxFee: (2000).microAlgos(),
  });
  console.log(`Cerrando registro de compromisos en la ronda ${confirmation?.confirmedRound}`);
  return { txId, confirmedRound: confirmation?.confirmedRound ?? 0n };
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

async function leerContratoBaseDatos(bd, contratoId) {
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

async function leerCuentaBaseDatos(bd, cuentaId) {
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



