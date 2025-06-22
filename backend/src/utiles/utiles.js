import { Buffer } from 'node:buffer';
import { randomBytes, createHash } from 'node:crypto';
import * as circomlibjs from 'circomlibjs';

const poseidon = await circomlibjs.buildPoseidon();

/**
 * Calcula el hash Poseidon de una cadena de entrada.
 * La cadena se convierte a bytes (UTF-8), luego a un BigInt, y este BigInt se usa como entrada para Poseidon.
 * @param {string} inputString La cadena de entrada para hashear.
 * @returns {string} El hash Poseidon como una cadena hexadecimal (prefijada con '0x').
 */
export function calcularPoseidonHash(inputString) {
  // Convertir la cadena a Buffer (UTF-8)
  const buffer = Buffer.from(inputString, 'utf-8');
  const hexString = buffer.toString('hex');

  // Convertir el Buffer (representado como hexadecimal) a BigInt. Manejar cadena vacía.
  const bigIntValue = hexString.length === 0 ? 0n : BigInt('0x' + hexString);

  const hash = poseidon([bigIntValue]); // poseidon de circomlibjs devuelve un BigInt
  return '0x' + hash.toString(16);
}

export function calcularSha256(str) {
  return createHash('sha256').update(str).digest('hex').toUpperCase();
}

export function randomSha256() {
  // Generar 32 bytes aleatorios (256 bits)
  const aleatorio = randomBytes(32);

  // Hashear con SHA-256 (devuelve Buffer)
  const hash = createHash('sha256').update(aleatorio).digest('hex').toUpperCase();

  // console.log('Random:', aleatorio.toString('hex'));
  // console.log('SHA-256:', hash);

  return hash; // Retornar el hash en formato hexadecimal
}


