import { AlgorandClient } from '@algorandfoundation/algokit-utils';
import { CONFIG } from '../utiles/constantes.js';

export const algorand = 
  
  CONFIG.ALGO_ENV === 'mainnet' ? AlgorandClient.mainNet() :
  CONFIG.ALGO_ENV === 'testnet' ? AlgorandClient.testNet() :
  CONFIG.ALGO_ENV === 'localnet' ? AlgorandClient.defaultLocalNet() : null;

if(!algorand) {
  throw new Error(`Entorno de Algorand no configurado correctamente: ${CONFIG.ALGO_ENV}`);
} 

export const algod = algorand.client.algod;
export const indexer = algorand.client.indexer;
