import fs from 'node:fs';
import { MerkleTree } from 'merkletreejs';
import { calcularPoseidon2 } from './utilesCrypto.js';

const PROFUNDIDAD = 11;
const NUM_HOJAS = 2 ** PROFUNDIDAD;

//----------------------------------------------------------------------------

export function calcularDatosArbol(totalHojas) {

  const numBloques =  Math.ceil(totalHojas / NUM_HOJAS);
  const tamBloque = Math.floor(totalHojas / numBloques);
  const tamResto = totalHojas % numBloques;

  return { numBloques, tamBloque, tamResto };
}

//----------------------------------------------------------------------------

export function calcularBloqueIndice(tamBloque, tamResto, indice) {

  // console.log(`Calculando bloque e índice para el índice ${indice} con tamBloque=${tamBloque} y tamResto=${tamResto}`);

  let bloque;
  let bloqueIdx;

  if(tamResto === 0) {

    bloque = Math.floor(indice / tamBloque);
    bloqueIdx = indice - (bloque * tamBloque);


  } else  {

    const limiteResto = (tamBloque + 1) * tamResto;
    // console.log(`Limite resto: ${limiteResto}`);

    if(indice < limiteResto) {
      bloque = Math.floor(indice / (tamBloque + 1));
      bloqueIdx = indice - (bloque * (tamBloque + 1));

    } else {
      bloque = Math.floor((indice - limiteResto) / tamBloque);
      bloqueIdx = (indice - limiteResto) - (bloque * tamBloque);
      bloque += tamResto;
    }
  }

  return { bloque, bloqueIdx };
}

//----------------------------------------------------------------------------

export function construirArbolPoseidon(compromisos) {
  const hojas = compromisos.map(c => Buffer.from(c, 'hex'));

  // // === Rellenar hasta 2048 hojas ===
  // const hojaNula = hashPoseidon(''); // hash de vacío
  // while (leaves.length < NUM_HOJAS) leaves.push(hojaNula);

  const arbol = new MerkleTree(hojas, calcularPoseidon2, { sortPairs: true });
  console.log(`Raíz del árbol Poseidon: ${arbol.getRoot().toString('hex')}`);
  console.log(`Número de hojas: ${arbol.getLeaves().length}`);

  // const arbol = {
  //   root: tree.getRoot().toString('hex'),
  //   leaves: compromisos,
  // };
  
  return arbol;
}

//----------------------------------------------------------------------------

// Guarda el árbol Merkle (objeto) en un fichero JSON
export function guardarArbolEnFichero(arbol, rutaFichero) {
  fs.writeFileSync(rutaFichero, JSON.stringify(arbol, null, 2));
  console.log(`Árbol Merkle guardado en ${rutaFichero}`);
}

// Lee un árbol Merkle desde un fichero JSON y lo devuelve como objeto
export function cargarArbolDeFichero(rutaFichero) {
  const contenido = fs.readFileSync(rutaFichero, 'utf8');
  return JSON.parse(contenido);
}

//----------------------------------------------------------------------------
