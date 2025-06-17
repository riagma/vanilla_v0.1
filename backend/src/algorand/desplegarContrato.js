// src/deployer/deployContract.js
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { stringifyJSON } from 'algosdk';

import algorand, { ELECTION_MNEMONIC } from './algorand.js';
import { inicializarEleccion } from './voto3.js';


const account = algorand.account.fromMnemonic(ELECTION_MNEMONIC);
console.log(`Cuenta de despliegue: ${account.addr}`);

export async function deployContract(artifactsDir) {
  const approvalFile = (await findFile(artifactsDir, '.approval.teal'));
  const clearFile = (await findFile(artifactsDir, '.clear.teal'));

  console.log(`Desplegando contrato desde: ${artifactsDir}`);
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

  //-------------

  const resultCreate = await algorand.send.appCreate(
    {
      sender: account.addr,
      approvalProgram,
      clearStateProgram,
      schema: {
        globalInts,
        globalByteSlices,
        localInts,
        localByteSlices,
      },
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

  console.log(`Contrato desplegado con éxito: ${resultCreate.appId}`);
  console.log(`  AppI:    ${resultCreate.appId}`);
  console.log(`  Address: ${resultCreate.appAddress}`);
  console.log(`  TxId:    ${resultCreate.txId}`);

  const resultPayment = await algorand.send.payment(
    {
      sender: account.addr,
      receiver: resultCreate.appAddress,
      amount: (100).algos(),
    },
    {
      skipWaiting: false,
      skipSimulate: true,
      maxRoundsToWaitForConfirmation: 12,
    }
  );

  console.log(`Contrato inicializado con éxito: ${resultPayment.txId}`);

  const resultInicializar = await inicializarEleccion (
    account.addr,
    resultCreate.appId,
    [] // No args para inicializar_eleccion
  )

  console.log(`Contrato inicializado con éxito: ${resultInicializar.txId}`);

  return {
    appId: resultCreate.appId,
    txId: resultCreate.txId,
    confirmedRound: resultCreate.confirmation?.confirmedRound ?? 0n,
  };
}

async function findFile(dir, suffix) {
  const files = await readFileDir(dir);
  return files.find((f) => f.toLowerCase().endsWith(suffix));
}

async function readFileDir(dir) {
  const { readdir } = await import('node:fs/promises');
  return readdir(dir);
}
