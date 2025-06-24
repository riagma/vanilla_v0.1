import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { stringifyJSON } from 'algosdk';

import { daos } from '../bd/DAOs.js';
import { CONFIG } from '../utiles/constantes.js';
import { algorand } from './algorand.js';
import { inicializarEleccion } from './serviciosVoto3.js';

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

export async function desplegarContrato(bd, eleccionId, cuentaId = 0) {

  console.log(`Desplegando contrato: ${eleccionId} - ${cuentaId} - ${CONFIG.ARTIFACTS_DIR}`);

  const { approvalProgram, clearStateProgram, schema } = await _leerArtefactos(CONFIG.ARTIFACTS_DIR);

  const { secreto } = _leerBaseDatos(bd, cuentaId);

  //-------------

  const account = algorand.account.fromMnemonic(secreto);
  console.log(`Cuenta de despliegue: ${account.addr}`);

  const resultCreate = await algorand.send.appCreate(
    {
      sender: account.addr,
      approvalProgram,
      clearStateProgram,
      schema,
    },
    {
      skipWaiting: false,
      skipSimulate: true,
      maxRoundsToWaitForConfirmation: 12,
      maxFee: (2000).microAlgos(),
    }
  );

  const { contratoId } = _escribirBaseDatos(bd, eleccionId, cuentaId, resultCreate.appId, resultCreate.appAddress);

  //-------------

  const resultPayment = await algorand.send.payment(
    {
      sender: account.addr,
      receiver: resultCreate.appAddress,
      amount: (1).algos(),
    },
    {
      skipWaiting: false,
      skipSimulate: true,
      maxRoundsToWaitForConfirmation: 12,
    }
  );

  console.log(`Pago enviado con éxito: ${resultPayment.confirmation?.confirmedRound} - ${resultPayment.txIds[0]}`);

  //-------------

  const resultadoInicializacion = await inicializarEleccion(bd, {
    contratoId,
    nombreToken: 'VOTO3',
    nombreUnidades: 'VT3',
    numeroUnidades: BigInt(100000000),
  });

  console.log(`Contrato inicializado con éxito, con asset id = ${resultadoInicializacion}`);

  //--------------

  console.log(`Contrato desplegado con éxito:`);
  console.log(`  contratoId: ${contratoId}`);
  console.log(`  appId:      ${resultCreate.appId}`);
  console.log(`  appAddr:    ${resultCreate.appAddress}`);

  return {
    contratoId,
    appId: resultCreate.appId,
    appAddr: resultCreate.appAddress
  };
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

async function _leerArtefactos(artifactsDir) {

  const approvalFile = (await _findFile(artifactsDir, '.approval.teal'));
  const clearFile = (await _findFile(artifactsDir, '.clear.teal'));

  console.log(`  Approval TEAL: ${approvalFile}`);
  console.log(`  Clear TEAL   : ${clearFile}`);

  if (!approvalFile || !clearFile) {
    throw new Error('No se encontraron los TEAL de approval o clear en ' + artifactsDir);
  }

  const approvalProgram = await readFile(path.join(artifactsDir, approvalFile), 'utf8');
  const clearStateProgram = await readFile(path.join(artifactsDir, clearFile), 'utf8');

  // Intenta cargar schema desde appspec, si existe
  let globalInts = 0, globalByteSlices = 0, localInts = 0, localByteSlices = 0;
  const specFile = (await _findFile(artifactsDir, '.json'));
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

//----------------------------------------------------------------------------

function _leerBaseDatos(bd, cuentaId) {
  try {
    console.log(`Obtenido datos cuenta ${cuentaId} algorand ...`);
    const cuentaBlockchain = daos.cuentaBlockchain.obtenerPorId(bd, { cuentaId });

    console.log('Datos obtenidos con éxito: ', cuentaBlockchain);
    return {
      bd,
      secreto: cuentaBlockchain.accSecret,
    }

  } catch (error) {
    throw new Error('Error obtenido datos cuenta: ' + error.message);
  }
}

//----------------------------------------------------------------------------

function _escribirBaseDatos(bd, contratoId, cuentaId, appId, appAddr) {
  try {
    console.log('Guardando datos contrato algorand ...');
    const resultado = daos.contratoBlockchain.crear(bd, {
      contratoId,
      cuentaId,
      appId: String(appId),
      appAddr: String(appAddr),
    });
    console.log('Datos guardados con éxito: ', resultado);
    return { contratoId: resultado };
  } catch (error) {
    throw new Error('Error al guardando datos contrato: ' + error.message);
  }
}

//----------------------------------------------------------------------------

async function _findFile(dir, suffix) {
  const files = await _readFileDir(dir);
  return files.find((f) => f.toLowerCase().endsWith(suffix));
}

async function _readFileDir(dir) {
  const { readdir } = await import('node:fs/promises');
  return readdir(dir);
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
