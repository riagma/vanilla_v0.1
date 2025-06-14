// src/deployer/deployContract.js
import { readFile }   from 'node:fs/promises';
import path           from 'node:path';
import { randomBytes } from 'node:crypto';

import algorand, { account } from './algorand.js';
import { stringifyJSON } from 'algosdk';

/**
 * Despliega un contrato TEAL y devuelve appId, txID y confirmedRound.
 *
 * @param {string} artifactsDir  Ruta al directorio que contiene:
 *                               - *_approval.teal
 *                               - *_clear.teal
 *                               - (opcional) *_appspec.json
 * @param {object} [opts]
 * @param {boolean} [opts.wait=true]  Esperar confirmación del bloque
 * @param {number}  [opts.maxRounds=12] Nº máx. de rondas a esperar
 * @returns {Promise<{appId: bigint, txID: string, confirmedRound: bigint}>}
 */
export async function deployContract (
  artifactsDir,
  { wait = true, maxRounds = 12 } = {},
) {
  const approvalFile = (await findFile(artifactsDir, '.approval.teal'));
  const clearFile    = (await findFile(artifactsDir, '.clear.teal'));

  console.log(`Desplegando contrato desde: ${artifactsDir}`);
  console.log(`  Approval TEAL: ${approvalFile}`);
  console.log(`  Clear TEAL   : ${clearFile}`);

  if (!approvalFile || !clearFile) {
    throw new Error('No se encontraron los TEAL de approval o clear en ' + artifactsDir);
  }

  const approvalProgram = await readFile(path.join(artifactsDir, approvalFile), 'utf8');
  const clearStateProgram    = await readFile(path.join(artifactsDir, clearFile), 'utf8');

  // Intenta cargar schema desde appspec, si existe
  let globalInts = 0, globalBytes = 0, localInts = 0, localBytes = 0;
  const specFile = (await findFile(artifactsDir, '.json'));
  if (specFile) {
    const specJson = JSON.parse(await readFile(path.join(artifactsDir, specFile), 'utf8'));
    console.log(`  Cargando esquema desde: ${stringifyJSON(specJson.state.schema.global)}`);
    globalInts = specJson.state.schema.global?.ints ?? 0;
    globalBytes = specJson.state.schema.global?.bytes ?? 0;
    localInts = specJson.state.schema.local?.ints ?? 0;
    localBytes = specJson.state.schema.local?.bytes ?? 0;
  }

  console.log(`  Global State Schema: ${globalInts} ints, ${globalBytes} bytes`);
  console.log(`  Local State Schema : ${localInts} ints, ${localBytes} bytes`);

  const result = await algorand.send.appCreate({
    sender: account.addr,
    approvalProgram,
    clearStateProgram,
    globalStateSchema: { ints: globalInts, bytes: globalBytes },
    localStateSchema:  { ints: localInts,  bytes: localBytes },

    lease: Uint8Array.from(randomBytes(32)),

    skipWaiting: false,
    skipSimulate: true, 
    maxRoundsToWaitForConfirmation: 12,
  });

  console.log(`Contrato desplegado con éxito: ${result.appId}`);
  console.log(`  txID: ${result.txID}`);

  return {
    appId:          result.appId,
    txID:           result.txID,
    confirmedRound: result.confirmation?.confirmedRound ?? 0n,
  };
}

/* ---------- helpers ---------- */

async function findFile (dir, suffix) {
  const files = await readFileDir(dir);
  return files.find((f) => f.toLowerCase().endsWith(suffix));
}

async function readFileDir (dir) {
  const { readdir } = await import('node:fs/promises');
  return readdir(dir);
}
