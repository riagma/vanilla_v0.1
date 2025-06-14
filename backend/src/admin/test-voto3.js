#!/usr/bin/env node
/**
 * Lanza registrar_compromiso N veces (por defecto 1).
 *
 *   $ node registrar_compromiso.js         # 1 llamada
 *   $ node registrar_compromiso.js 10      # 10 llamadas
 *
 * Requiere:
 *   - src/algorand.js
 *   - src/services/voto3.js  (exporta registrarCompromisoN)
 *   - Variables en .env.{localnet|testnet}: DEPLOYER_MNEMONIC, APP_ID…
 */

import { registrarCompromiso } from '../algorand/voto3.js';
import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Cargar el .env adecuado (igual que en algorand.js)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, `.env.${process.env.NODE_ENV || 'localnet'}`) });

// Nº de veces (arg 0 = «node», arg 1 = script, arg 2 = valor opcional)
const veces = parseInt(process.argv[2] ?? '1', 10);

(async () => {
    try {
        console.log(`🚀  Registrando compromiso ${veces} veces...`);
        for (let i = 0; i < veces; i++) {
            console.log(`🔄  Llamada ${i + 1}/${veces}`);
            await registrarCompromiso();
        }
        console.log(`✅  ${veces} compromisos registrados correctamente.`);
        await registrarCompromiso();
        console.log('✔️  Finalizado sin errores');
        process.exit(0);
    } catch (err) {
        console.error('❌  Error al ejecutar registrar_compromiso:', err);
        process.exit(1);
    }
})();
