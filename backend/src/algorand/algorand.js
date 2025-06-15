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
export const DISPENSER = process.env.DISPENSER || 'dispenser';

const algorand = 
  ENTORNO === 'mainnet' ? AlgorandClient.defaultMainNet() :
  ENTORNO === 'testnet' ? AlgorandClient.defaultTestNet() : 
  
  AlgorandClient.defaultLocalNet();

export const dispenser = algorand.account.fromMnemonic(DISPENSER);
console.log(`Dispenser: ${String(dispenser.addr)}`);
 
export const algod = algorand.client.algod;
export const indexer = algorand.client.indexer;

export default algorand;
