#!/usr/bin/env node
/**
 * Despliega un contrato desde artefactos TEAL usando deployContract().
 * Uso:
 *   node deploy-contract.js ./smart_contracts/artifacts/voto3
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { deployContract } from '../algorand/deployContract.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, `.env.${process.env.NODE_ENV || 'localnet'}`) });

const artifactsDir = process.argv[2];
if (!artifactsDir) {
    console.error('Uso: node deploy-contract.js <carpeta-artefactos>');
    process.exit(1);
}

console.log('🚀  Desplegando contrato desde:', artifactsDir);

try {
    const { appId, txID, confirmedRound } = await deployContract(path.resolve(artifactsDir));

    console.log('✅  Deploy completado');
    if (appId !== undefined) console.log('   appId          :', appId.toString());
    if (txID !== undefined) console.log('   txID           :', txID);
    if (round !== undefined) console.log('   confirmedRound :', round.toString());
} catch (err) {
    console.error('❌  Error en el deploy:', err);
    process.exit(1);
}
