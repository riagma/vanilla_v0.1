#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { desplegarContrato } from '../algorand/desplegarContrato.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, `.env.${process.env.NODE_ENV || 'localnet'}`) });

const cuentaId = process.argv[2];
const eleccionId = process.argv[3];
const contratoDir = process.argv[4];

if (!cuentaId || !eleccionId || !contratoDir) {
    console.error('Uso: node desplegar-contrato.js <cuenta-id> <elección-id> <carpeta-artefactos>');
    process.exit(1);
}

try {
    const { appId, appAddr } = await desplegarContrato(
        cuentaId,
        eleccionId,
        path.resolve(contratoDir)
    );
    console.log('Deploy completado:');
    console.log('  appId   :', appId.toString());
    console.log('  appAddr :', appAddr);
} catch (err) {
    console.error('Error en el despliegue:', err);
    process.exit(1);
}
