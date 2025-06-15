#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { deployContract } from '../algorand/desplegarContrato.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, `.env.${process.env.NODE_ENV || 'localnet'}`) });

const artifactsDir = process.argv[2];
if (!artifactsDir) {
    console.error('Uso: node desplegar-contrato.js <carpeta-artefactos>');
    process.exit(1);
}

console.log('Desplegando contrato desde:', artifactsDir);

try {
    const { appId, txId, confirmedRound } = await deployContract(path.resolve(artifactsDir));

    console.log('Deploy completado');
    if (appId !== undefined) console.log('   appId          :', appId.toString());
    if (txId !== undefined) console.log('   txId           :', txId);
    if (confirmedRound !== undefined) console.log('   confirmedRound :', confirmedRound.toString());
} catch (err) {
    console.error('Error en el deploy:', err);
    process.exit(1);
}
