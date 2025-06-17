import { AlgorandClient } from '@algorandfoundation/algokit-utils';
import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Cargar el .env adecuado (igual que en algorand.js)
const __dirname = path.dirname(fileURLToPath(import.meta.url)) + '/../..';
const dotenvPath = path.join(__dirname, `.env.${process.env.NODE_ENV || 'localnet'}`);
console.log(`Cargando configuración desde: ${dotenvPath}`);
config({ path: dotenvPath });

export const ENTORNO = process.env.NODE_ENV || 'localnet';
export const DISPENSER = process.env.DISPENSER;

const algorand = 
  ENTORNO === 'mainnet' ? AlgorandClient.defaultMainNet() :
  ENTORNO === 'testnet' ? AlgorandClient.defaultTestNet() : 
  
  AlgorandClient.defaultLocalNet();

let dispenserConf;

if(DISPENSER) {
  dispenserConf = algorand.account.fromMnemonic(DISPENSER);
} else {
  dispenserConf = await algorand.account.localNetDispenser();
}
  
export const dispenser = dispenserConf;
console.log(`Dispenser: ${String(dispenser.addr)}`);
 
export const algod = algorand.client.algod;
export const indexer = algorand.client.indexer;

// Esto debería estar en base de datos, pero por ahora lo dejamos aquí
export const ELECTION_ADDRESS = process.env.ELECTION_ADDRESS;
export const ELECTION_MNEMONIC = process.env.ELECTION_MNEMONIC;

export const ELECTION_APP_ID = process.env.ELECTION_APP_ID;
export const ELECTION_APP_ADDRESS = process.env.ELECTION_APP_ADDRESS;


export default algorand;
