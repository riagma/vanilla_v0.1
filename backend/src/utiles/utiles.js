import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { poseidon } from 'circomlibjs';

/**
 * Calcula el hash Poseidon de una cadena de entrada.
 * La cadena se convierte a bytes (UTF-8), luego a un BigInt, y este BigInt se usa como entrada para Poseidon.
 * @param {string} inputString La cadena de entrada para hashear.
 * @returns {string} El hash Poseidon como una cadena hexadecimal (prefijada con '0x').
 */
export function calculatePoseidonHash(inputString) {
  // Convertir la cadena a Buffer (UTF-8)
  const buffer = Buffer.from(inputString, 'utf-8');
  const hexString = buffer.toString('hex');

  // Convertir el Buffer (representado como hexadecimal) a BigInt. Manejar cadena vacía.
  const bigIntValue = hexString.length === 0 ? 0n : BigInt('0x' + hexString);

  const hash = poseidon([bigIntValue]); // poseidon de circomlibjs devuelve un BigInt
  return '0x' + hash.toString(16);
}

export function poseidonOfSha256(str) {
  const sha256 = createHash('sha256').update(str).digest('hex');
  return poseidon([BigInt('0x' + sha256)]);
}
