// import fs from 'node:fs'; // para streams y métodos sync
// import fsp from 'node:fs/promises'; // para métodos async/promesa
// import zlib from 'node:zlib';
// import path from 'node:path';
// import { fileURLToPath } from 'node:url';

// import { compile, createFileManager } from "@noir-lang/noir_wasm";
// import { UltraHonkBackend } from "@aztec/bb.js";
// import { Noir } from "@noir-lang/noir_js";

// import initNoirC from "@noir-lang/noirc_abi";
// import initACVM from "@noir-lang/acvm_js";
// import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
// import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";

// Initialize WASM modules
// await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);

import { ArbolMerkle } from './ArbolMerkle.js'
import { calcularPoseidon2, calcularSha256, bigInt2HexStr } from './utilesCrypto.js';
import { diagnosticarCircuito, generarPrueba } from './utilesZK.js';

const PROFUNDIDAD = 11;

const MAX_NUM_HOJAS = 2 ** (PROFUNDIDAD);
const MIN_NUM_HOJAS = 2 ** (PROFUNDIDAD - 1) + 1;

const HOJA_POR_DEFECTO = 666n;


//----------------------------------------------------------------------------

export async function cargarFicheroMerkle11(urlCircuito) {

  const respCircuito = await fetch(urlCircuito);
  if (!respCircuito.ok) {
    throw new Error('No se pudo cargar el archivo: ' + urlCircuito);
  }
  const merkle11Texto = await respCircuito.text();
  const merkle11Json = JSON.parse(merkle11Texto);
  if (!merkle11Json || typeof merkle11Json !== 'object') {
    throw new Error('El archivo de circuito no es un JSON válido o la URL es incorrecta');
  }

  return merkle11Json;
}

//----------------------------------------------------------------------------

export async function cargarFicheroCompromisos(urlCompromisos) {
  const respCompromisos = await fetch(urlCompromisos);
  if (!respCompromisos.ok) {
    throw new Error('No se pudo cargar el archivo: ' + urlCompromisos);
  }
  const compromisosTexto = await respCompromisos.text();
  const compromisosJson = JSON.parse(compromisosTexto);
  if (!compromisosJson || !Array.isArray(compromisosJson)) {
    throw new Error('El archivo de compromisos no es un JSON válido o la URL es incorrecta');
  }

  return compromisosJson;
}

//----------------------------------------------------------------------------

export async function calcularPruebaDatosPublicos(
  clave,
  anulador,
  bloqueIdx,
  urlCircuito,
  urlCompromisos) {

  console.log('Clave:', clave, bigInt2HexStr(BigInt(clave)));
  console.log('Anulador:', anulador, bigInt2HexStr(BigInt(anulador)));
  console.log('BloqueIdx:', bloqueIdx);
  console.log('Merkle11:', urlCircuito);
  console.log('Compromisos:', urlCompromisos);

  const circuito = await cargarFicheroMerkle11(urlCircuito);
  const compromisos = await cargarFicheroCompromisos(urlCompromisos);

  const arbolMerkle = construirArbolMerkle(compromisos);

  const { path, idxs } = arbolMerkle.generarPrueba(bloqueIdx);
  const anulador_hash = calcularPoseidon2([BigInt(anulador)]).toString();

  const inputs = {
    clave, anulador,
    path: path.map(x => x.toString()),
    idxs: idxs.map(x => x.toString()),
    raiz: arbolMerkle.raiz.toString(),
    anulador_hash,
  };

  console.log('Inputs:', inputs);

  // const circuito = await diagnosticarCircuito(urlCircuito);

  const { proof, publicInputs } = await generarPrueba(circuito, inputs);

  const proofHash = await calcularSha256(proof);

  const datosPublicos = publicInputs.map(pi => BigInt(pi).toString());
  console.log('Datos públicos:', datosPublicos);
  console.log('Proof Hash:', proofHash);

  return { proof, publicInputs };
}

//----------------------------------------------------------------------------

// export function calcularDatosArbol(totalHojas) {

//   const numBloques = Math.ceil(totalHojas / MAX_NUM_HOJAS);
//   const tamBloque = Math.floor(totalHojas / numBloques);
//   const tamResto = totalHojas % numBloques;

//   return { numBloques, tamBloque, tamResto };
// }

//----------------------------------------------------------------------------

export function calcularBloqueIndice(tamBloque, tamResto, indice) {

  let bloque;
  let bloqueIdx;

  if (tamResto === 0) {

    bloque = Math.floor(indice / tamBloque);
    bloqueIdx = indice - (bloque * tamBloque);

  } else {

    const limiteResto = (tamBloque + 1) * tamResto;
    // console.log(`Limite resto: ${limiteResto}`);

    if (indice < limiteResto) {
      bloque = Math.floor(indice / (tamBloque + 1));
      bloqueIdx = indice - (bloque * (tamBloque + 1));

    } else {
      bloque = Math.floor((indice - limiteResto) / tamBloque);
      bloqueIdx = (indice - limiteResto) - (bloque * tamBloque);
      bloque += tamResto;
    }
  }

  console.log(`Calculando para ${indice}:${tamBloque}:${tamResto} => ${bloque}:${bloqueIdx}`);

  return { bloque, bloqueIdx };
}

//----------------------------------------------------------------------------

export function construirArbolMerkle(compromisos) {

  if (!Array.isArray(compromisos) || compromisos.length === 0 || compromisos.length > MAX_NUM_HOJAS) {
    throw new Error(`El número de compromisos debe ser un array no vacío y con un máximo de ${MAX_NUM_HOJAS} elementos.`);
  }

  const hojas = compromisos.map(c => BigInt(c));

  if (hojas.length < MIN_NUM_HOJAS) {
    while (hojas.length < MIN_NUM_HOJAS) {
      hojas.push(HOJA_POR_DEFECTO);
    }
    console.log(`Se añaden ${MIN_NUM_HOJAS - hojas.length} hojas extras`);
  }

  const arbolMerkle = new ArbolMerkle(hojas);

  console.log(`Raíz del árbol Poseidon: ${arbolMerkle.raiz.toString()}`);
  console.log(`Número de hojas: ${arbolMerkle.numHojas}`);

  return arbolMerkle;
}

//----------------------------------------------------------------------------

// export async function comprimirArchivo(origen, destinoGz) {
//   return new Promise((resolve, reject) => {
//     const input = fs.createReadStream(origen);
//     const output = fs.createWriteStream(destinoGz);
//     const gzip = zlib.createGzip();

//     input.pipe(gzip).pipe(output);

//     output.on('finish', () => {
//       console.log(`Archivo comprimido: ${destinoGz}`);
//       resolve();
//     });
//     output.on('error', reject);
//     input.on('error', reject);
//     gzip.on('error', reject);
//   });
// }

//----------------------------------------------------------------------------

// export function esArchivoGzip(rutaFichero) {
//   const fd = fs.openSync(rutaFichero, 'r');
//   const buffer = Buffer.alloc(2);
//   fs.readSync(fd, buffer, 0, 2, 0);
//   fs.closeSync(fd);
//   // Gzip: 0x1f 0x8b
//   return buffer[0] === 0x1f && buffer[1] === 0x8b;
// }

//----------------------------------------------------------------------------

// export async function descomprimirArchivo(origenGz, destino) {
//   return new Promise((resolve, reject) => {
//     const input = fs.createReadStream(origenGz);
//     const output = fs.createWriteStream(destino);
//     const gunzip = zlib.createGunzip();

//     input.pipe(gunzip).pipe(output);

//     output.on('finish', () => {
//       console.log(`Archivo descomprimido: ${destino}`);
//       resolve();
//     });
//     output.on('error', reject);
//     input.on('error', reject);
//     gunzip.on('error', reject);
//   });
// }

//----------------------------------------------------------------------------

// export async function descomprimirArchivoMemo(archivoGz) {
//   const bufferGz = await fsp.readFile(archivoGz);
//   return new Promise((resolve, reject) => {
//     zlib.gunzip(bufferGz, (err, bufferDescomprimido) => {
//       if (err) return reject(err);
//       const texto = bufferDescomprimido.toString('utf8');
//       resolve(texto);
//     });
//   });
// }

//----------------------------------------------------------------------------

// // Guarda el árbol Merkle (objeto) en un fichero JSON
// export function guardarArbolEnFichero(arbol, rutaFichero) {
//   fs.writeFileSync(rutaFichero, JSON.stringify(arbol, null, 2));
//   console.log(`Árbol Merkle guardado en ${rutaFichero}`);
// }

// // Lee un árbol Merkle desde un fichero JSON y lo devuelve como objeto
// export function cargarArbolDeFichero(rutaFichero) {
//   const contenido = fs.readFileSync(rutaFichero, 'utf8');
//   return JSON.parse(contenido);
// }

//----------------------------------------------------------------------------
