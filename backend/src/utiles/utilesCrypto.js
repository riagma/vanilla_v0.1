// const isNode = typeof window === 'undefined';
// const webcrypto = isNode ? (await import('node:crypto')).webcrypto : crypto;

import { Buffer } from 'node:buffer';
import { randomBytes, createHash, webcrypto } from 'node:crypto';
import * as circomlibjs from 'circomlibjs';


export const poseidon = await circomlibjs.buildPoseidon();

export function calcularPoseidonHash(cadena) {
  const buffer = Buffer.from(cadena, 'utf-8');
  const hexString = buffer.toString('hex');
  const bigIntValue = hexString.length === 0 ? 0n : BigInt('0x' + hexString);
  const hash = poseidon([bigIntValue]);
  return poseidon.F.toString(hash, 16).toUpperCase();
  // return '0x' + hash.toString(16).toUpperCase();
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

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

const codificador = new TextEncoder();
const decodificador = new TextDecoder();

async function derivarClave(claveTexto, sal) {
  const claveBase = await webcrypto.subtle.importKey(
    'raw', codificador.encode(claveTexto), { name: 'PBKDF2' }, false, ['deriveKey']
  );
  return webcrypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: sal,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    claveBase,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encriptarJSON(objeto, claveTexto) {
  const vectorInicial = webcrypto.getRandomValues(new Uint8Array(12));
  const sal = webcrypto.getRandomValues(new Uint8Array(16));
  const clave = await derivarClave(claveTexto, sal);
  const datos = codificador.encode(JSON.stringify(objeto));
  const cifrado = new Uint8Array(await webcrypto.subtle.encrypt(
    { name: 'AES-GCM', iv: vectorInicial }, clave, datos
  ));
  // Formato: sal(16) + vectorInicial(12) + cifrado(n)
  const resultado = new Uint8Array(16 + 12 + cifrado.length);
  resultado.set(sal, 0);
  resultado.set(vectorInicial, 16);
  resultado.set(cifrado, 28);
  return Buffer.from(resultado).toString('base64');
}

export async function desencriptarJSON(cifradoBase64, claveTexto) {
  const binario = Uint8Array.from(Buffer.from(cifradoBase64, 'base64'));
  const sal = binario.slice(0, 16);
  const vectorInicial = binario.slice(16, 28);
  const cifrado = binario.slice(28);
  const clave = await derivarClave(claveTexto, sal);
  const plano = await webcrypto.subtle.decrypt(
    { name: 'AES-GCM', iv: vectorInicial }, clave, cifrado
  );
  return JSON.parse(decodificador.decode(plano));
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

