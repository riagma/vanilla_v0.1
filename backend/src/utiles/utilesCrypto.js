import { Buffer } from 'node:buffer';
import { randomBytes, createHash } from 'node:crypto';
import * as circomlibjs from 'circomlibjs';

export const poseidon = await circomlibjs.buildPoseidon();

export function calcularPoseidonHash(cadena) {
  const buffer = Buffer.from(cadena, 'utf-8');
  const hexString = buffer.toString('hex');

  const bigIntValue = hexString.length === 0 ? 0n : BigInt('0x' + hexString);

  const hash = poseidon([bigIntValue]);
  return '0x' + hash.toString(16).toUpperCase();
}

export function calcularSha256(str) {
  return createHash('sha256').update(str).digest('hex').toUpperCase();
}

export function randomSha256() {
  const aleatorio = randomBytes(32);

  const hash = createHash('sha256').update(aleatorio).digest('hex').toUpperCase();

  // console.log('Random:', aleatorio.toString('hex'));
  // console.log('SHA-256:', hash);

  return hash; 
}


