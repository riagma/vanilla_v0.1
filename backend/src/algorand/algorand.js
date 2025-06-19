import { AlgorandClient } from '@algorandfoundation/algokit-utils';

import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.NODE_ENV = process.env.NODE_ENV || 'LocalNet';

const __dirname = path.dirname(fileURLToPath(import.meta.url)) + '/../..';
const dotenvPath = path.join(__dirname, `.env.${process.env.NODE_ENV}`);
console.log(`Cargando configuración desde: ${dotenvPath}`);
config({ path: dotenvPath });

export const algorand = 
  
  process.env.NODE_ENV === 'MainNet' ? AlgorandClient.mainNet() :
  process.env.NODE_ENV === 'TestNet' ? AlgorandClient.testNet() :
  process.env.NODE_ENV === 'LocalNet' ? AlgorandClient.defaultLocalNet() : null;

if(!algorand) {
  throw new Error(`Entorno de Algorand no configurado correctamente: ${process.env.NODE_ENV}`);
} 

export const algod = algorand.client.algod;
export const indexer = algorand.client.indexer;
