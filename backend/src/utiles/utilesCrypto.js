// const isNode = typeof window === 'undefined';
// const webcrypto = isNode ? (await import('node:crypto')).webcrypto : crypto;

import { Buffer } from 'node:buffer';
import { randomBytes, createHash, webcrypto } from 'node:crypto';

import { poseidon1, poseidon2, poseidon3, poseidon4 } from 'poseidon-lite'
import { poseidon2Hash, poseidon2HashAsync } from "@zkpassport/poseidon2"

import { calcularPoseidon2 } from './poseidon2.js';

import * as circomlibjs from 'circomlibjs';
import { da } from '@faker-js/faker';
export const poseidon = await circomlibjs.buildPoseidon();

//----------------------------------------------------------------------------

// No compatible con noir-lang
export function calcularPoseidonLite(datos) {

  const inputs = Array.isArray(datos) ? datos : [datos];

  for (const x of inputs) {
    if (typeof x !== 'bigint' && typeof x !== 'number' && typeof x !== 'string') {
      throw new Error('Todos los elementos de entrada deben ser BigInt');
    }
  }
  
  if (inputs.length === 1) {
    return poseidon1(inputs);
  } else if (inputs.length === 2) {
    return poseidon2(inputs);
  } else if (inputs.length === 3) {
    return poseidon3(inputs);
  } else if (inputs.length === 4) {
    return poseidon4(inputs);
  } else { return 0n }
}

//----------------------------------------------------------------------------

// Compatible con noir-lang in: BigInt[] out: BigInt
export function calcularPoseidonCircom(datos) {

  const inputs = Array.isArray(datos) ? datos : [datos];

  for (const x of inputs) {
    if (typeof x !== 'bigint') {
      throw new Error('Todos los elementos de entrada deben ser BigInt');
    }
  }

  return poseidon2Hash(inputs);
}

//----------------------------------------------------------------------------

// Compatible con noir-lang in: BigInt[] out: BigInt
export async function calcularPoseidon2ZkPassport(datos) {

  const inputs = Array.isArray(datos) ? datos : [datos];

  for (const x of inputs) {
    if (typeof x !== 'bigint') {
      throw new Error('Todos los elementos de entrada deben ser BigInt');
    }
  }

  return await poseidon2HashAsync(inputs);
}

//----------------------------------------------------------------------------

// Compatible con noir-lang in: BigInt[] out: BigInt
export async function calcularPoseidon2Noir(datos) {

  const inputsTmp = Array.isArray(datos) ? datos : [datos];

  for (const x of inputsTmp) {
    if (typeof x !== 'bigint') {
      throw new Error('Todos los elementos de entrada deben ser BigInt');
    }
  }

  const inputs = Array(2).fill('0');

  for (let i = 0; i < Math.min(inputsTmp.length, 2); i++) {
    
    inputs[i] = inputsTmp[i].toString();
  }

  console.log('calcularPoseidon2Noir inputs:', inputs);

  const hashHex = await calcularPoseidon2(inputs);

  console.log('calcularPoseidon2Noir output:', hashHex);


  return hexStr2BigInt(hashHex);
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

export function calcularSha256(datos) {
  return createHash('sha256').update(datos).digest('hex');
}

export function randomSha256() {
  const aleatorio = randomBytes(32);
  return calcularSha256(aleatorio);
}

export function hexStr2BigInt(hexStr) {
  return BigInt(hexStr.startsWith("0x") ? hexStr : "0x" + hexStr);
}

export function bigInt2HexStr(bigIntValue) {
  let hex = bigIntValue.toString(16);
  return hex.length % 2 ? "0x0" + hex : "0x" + hex;
}

export function concatenarBigInts(a, b) {

  // 1. Convertir a hex (sin 0x)
  let hexA = a.toString(16);
  let hexB = b.toString(16);

  // 2. Rellenar si longitud impar
  if (hexA.length % 2) hexA = '0' + hexA;
  if (hexB.length % 2) hexB = '0' + hexB;

  // 3. Convertir a Buffer
  const bufA = Buffer.from(hexA, 'hex');
  const bufB = Buffer.from(hexB, 'hex');

  // 4. Concatenar
  return Buffer.concat([bufA, bufB]);
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

