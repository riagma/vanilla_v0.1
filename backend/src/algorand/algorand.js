import { AlgorandClient } from '@algorandfoundation/algokit-utils';
import { config }               from 'dotenv';
import path                     from 'node:path';
import { fileURLToPath }        from 'node:url';

// Cargar el .env adecuado (igual que en algorand.js)
const __dirname = path.dirname(fileURLToPath(import.meta.url)) + '/../..'; 
const dotenvPath = path.join(__dirname, `.env.${process.env.NODE_ENV || 'localnet'}`);
console.log(`Cargando configuración desde: ${dotenvPath}`);
config({ path: dotenvPath });

const algorand =
  process.env.NODE_ENV === 'testnet'
    ? AlgorandClient.defaultTestNet()
    : AlgorandClient.defaultLocalNet(); // puerto 4001/4002/8980

export const algod   = algorand.client.algod;
export const account = algorand.account.fromMnemonic(process.env.DEPLOYER_MNEMONIC);
export default algorand;
