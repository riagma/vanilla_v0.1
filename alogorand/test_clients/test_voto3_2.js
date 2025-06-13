import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'localnet'}` });

import { Voto3Client } from './../dist/voto3';

// Define los parámetros de la transacción usando variables de entorno
const algodToken = process.env.ALGOD_TOKEN;
const algodServer = process.env.ALGOD_SERVER;
const algodPort = process.env.ALGOD_PORT;

// Define las cuentas usando variables de entorno
const deployerMnemonic = process.env.DEPLOYER_MNEMONIC;
const appId = parseInt(process.env.APP_ID);

async function callAbrirRegistroCompromisosTest() {
    try {
        const client = new Voto3Client(algodToken, algodServer, algodPort, deployerMnemonic, appId);
        const confirmedTxn = await client.abrirRegistroCompromisos();
        console.log("Transacción confirmada:", confirmedTxn);
    } catch (err) {
        console.error("Error en la prueba abrir_registro_compromisos:", err);
    }
}

// Ejecuta la función de prueba
callAbrirRegistroCompromisosTest();