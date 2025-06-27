import { Buffer } from 'node:buffer';
import { TextDecoder } from 'node:util';

import { algod } from './algorand.js'

export function toNote(json) {
  const str = JSON.stringify(json);
  return new TextEncoder().encode(str);
}

export function fromNote(base64) {
  const bytes = Uint8Array.from(Buffer.from(base64, 'base64'));
  const str = new TextDecoder().decode(bytes);
  return JSON.parse(str);
}

export async function consultarSaldo(cuentaAddr) {
  const cuentaInfo = await algodClient.accountInformation(address).do();
  console.log("Saldo:", cuentaInfo.amount); // El saldo está en microAlgos
  return cuentaInfo.amount; 
}