// src/deployer/deployContract.js
import { obtenerDB } from '../bd/bd.js';
import { daos } from '../bd/daos.js';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { stringifyJSON } from 'algosdk';

import { algorand } from './algorand.js';
import {
  inicializarEleccion,
  establecerClienteVoto3,
  abrirRegistroCompromisos,
  cerrarRegistroCompromisos,
  registrarCompromiso
} from './serviciosVoto3.js';

export async function desplegarContrato(cuentaId, eleccionId, contratoDir) {

  console.log(`Desplegando contrato: ${cuentaId} - ${eleccionId} - ${contratoDir}`);

  const { approvalProgram, clearStateProgram, schema } = await leerArtefactos(contratoDir);
  const { bd, secreto } = await leerBaseDatos(cuentaId);

  //-------------

  const account = algorand.account.fromMnemonic(secreto);
  console.log(`Cuenta de despliegue: ${account.addr}`);

  const resultCreate = await algorand.send.appCreate(
    {
      sender: account.addr,
      approvalProgram,
      clearStateProgram,
      schema,
      // args: [Uint8Array.from([0x4c, 0x5c, 0x61, 0xba])],
      // lease: Uint8Array.from(randomBytes(32)),
    },
    {
      skipWaiting: false,
      skipSimulate: true,
      maxRoundsToWaitForConfirmation: 12,
      maxFee: (2000).microAlgos(),
    }
  );

  console.log(`Contrato desplegado con éxito:`);
  console.log(`  AppI:    ${resultCreate.appId}`);
  console.log(`  Address: ${resultCreate.appAddress}`);
  console.log(`  TxId:    ${resultCreate.txIds}`);

  const { contratoId } = await escribirBaseDatos(bd, cuentaId, resultCreate.appId, resultCreate.appAddress);

  const { sender, appId } = await establecerClienteVoto3(bd, { contratoId });

  console.log(`Cliente Voto3 establecido para contrato: ${appId}`);

  const resultPayment = await algorand.send.payment(
    {
      sender: sender,
      receiver: resultCreate.appAddress,
      amount: (100).algos(),
    },
    {
      skipWaiting: false,
      skipSimulate: true,
      maxRoundsToWaitForConfirmation: 12,
    }
  );

  console.log(`Contrato inicializado con éxito: ${resultPayment.txIds}`);

  //--------------

  // cspell:disable-next-line
  const compromiso = 'E3J64KABAP72GXJ3CQDYXYK456XQ4QYV2X4PODMXPSLRXOLZGA7AWZ2CRY'

  await abrirRegistroCompromisos(bd, { contratoId });
  // await registrarCompromiso(bd, { contratoId, compromiso });
  // await cerrarRegistroCompromisos(bd, { contratoId });

  //--------------



  process.exit(0); // Descomentar para evitar continuar con el despliegue

  const resultInicializar = await inicializarEleccion(
    account.addr,
    resultCreate.appId,
    [] // No args para inicializar_eleccion
  )

  console.log(`Contrato inicializado con éxito: ${resultInicializar.txId}`);

  return {
    appId: resultCreate.appId,
    appAddr: resultCreate.appAddress,
    appRound: resultCreate.confirmation?.confirmedRound ?? 0n,
  };
}

async function leerArtefactos(artifactsDir) {

  const approvalFile = (await findFile(artifactsDir, '.approval.teal'));
  const clearFile = (await findFile(artifactsDir, '.clear.teal'));

  console.log(`  Approval TEAL: ${approvalFile}`);
  console.log(`  Clear TEAL   : ${clearFile}`);

  if (!approvalFile || !clearFile) {
    throw new Error('No se encontraron los TEAL de approval o clear en ' + artifactsDir);
  }

  const approvalProgram = await readFile(path.join(artifactsDir, approvalFile), 'utf8');
  const clearStateProgram = await readFile(path.join(artifactsDir, clearFile), 'utf8');

  // Intenta cargar schema desde appspec, si existe
  let globalInts = 0, globalByteSlices = 0, localInts = 0, localByteSlices = 0;
  const specFile = (await findFile(artifactsDir, '.json'));
  if (specFile) {
    const specJson = JSON.parse(await readFile(path.join(artifactsDir, specFile), 'utf8'));
    console.log(`  Cargando esquema desde: ${stringifyJSON(specJson.state.schema)}`);
    globalInts = specJson.state.schema.global?.ints ?? 0;
    globalByteSlices = specJson.state.schema.global?.bytes ?? 0;
    localInts = specJson.state.schema.local?.ints ?? 0;
    localByteSlices = specJson.state.schema.local?.bytes ?? 0;
  }

  console.log(`  Global State Schema: ${globalInts} ints, ${globalByteSlices} bytes`);
  console.log(`  Local State Schema : ${localInts} ints, ${localByteSlices} bytes`);

  return {
    approvalProgram,
    clearStateProgram,
    schema: {
      globalInts,
      globalByteSlices,
      localInts,
      localByteSlices,
    },
  };
}

async function leerBaseDatos(cuentaId) {
  try {
    console.log('Conectando base de datos ...');
    const bd = await obtenerDB();

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

async function escribirBaseDatos(bd, cuentaId, appId, appAddr) {
  try {
    console.log('Guardando datos contrato algorand ...');
    const resultado = await daos.contratoBlockchain.crear(bd, {
      cuentaId,
      appId: String(appId),
      appAddr: String(appAddr),
    });
    console.log('Datos guardados con éxito: ', resultado);
    return { contratoId: resultado };
  } catch (error) {
    throw new Error('Error al guardando datos contrato: ' + error.message);
    // } finally {
    //   console.log('Desconectando base de datos ...');
    //   await bd.close();
  }
}

async function findFile(dir, suffix) {
  const files = await readFileDir(dir);
  return files.find((f) => f.toLowerCase().endsWith(suffix));
}

async function readFileDir(dir) {
  const { readdir } = await import('node:fs/promises');
  return readdir(dir);
}






