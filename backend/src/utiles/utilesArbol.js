import fs from 'node:fs';
import zlib from 'node:zlib';


import { ArbolMerkle } from './ArbolMerkle.js'

const PROFUNDIDAD = 11;

const MAX_NUM_HOJAS = 2 ** (PROFUNDIDAD);
const MIN_NUM_HOJAS = 2 ** (PROFUNDIDAD - 1) + 1;

const HOJA_POR_DEFECTO = 666n;

//----------------------------------------------------------------------------

export function calcularDatosArbol(totalHojas) {

  const numBloques =  Math.ceil(totalHojas / MAX_NUM_HOJAS);
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

export function comprimirArchivo(origen, destinoGz) {
  const input = fs.createReadStream(origen);
  const output = fs.createWriteStream(destinoGz);
  const gzip = zlib.createGzip();

  input.pipe(gzip).pipe(output);

  output.on('finish', () => {
    console.log(`Archivo comprimido: ${destinoGz}`);
  });
}

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
