#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'readline';

import { abrirConexionBD, cerrarConexionBD } from '../bd/BD.js';
import { eleccionDAO, pruebaZKDAO, raizZKDAO, registroVotanteEleccionDAO } from '../bd/DAOs.js';
import { calcularBloqueIndice, calcularDatosArbol, construirArbolPoseidon } from '../utiles/arbolMerkleOld.js';
import { CIRCUIT_DIR } from '../utiles/constantes.js';

const eleccionId = process.argv[2] ? parseInt(process.argv[2]) : undefined;

if (!eleccionId) {
  console.error(`Uso: node ${process.argv[1]} <elección-id>`);
  process.exit(1);
}

try {
  const bd = abrirConexionBD();

  const eleccion = eleccionDAO.obtenerPorId(bd, { id: eleccionId });

  if (!eleccion) {
    console.error(`No se encontró la elección con ID ${eleccionId}`);
    process.exit(1);
  }

  const pruebaZK = pruebaZKDAO.obtenerPorId(bd, { pruebaId: eleccionId });

  if (pruebaZK) {
    const reemplazarla = await preguntarUsuario(
      `La prueba ZK de la elección con ID ${eleccionId} ya ha sido creadas.\n` +
      '¿Deseas reemplazarla? (s/n): '
    );

    if (reemplazarla) {
      console.log(`Reemplazando la prueba ZK de la elección con ID ${eleccionId}`);
      raizZKDAO.eliminarPruebaZK(bd, eleccionId);
      pruebaZKDAO.eliminar(bd, { pruebaId: eleccionId });
    } else {
      console.log('Operación cancelada.');
      process.exit(0);
    }
  }

  const numHojas = registroVotanteEleccionDAO.obtenerSiguienteIdx(bd, eleccionId);
  console.log(`Número de hojas para la elección con ID ${eleccionId}: ${numHojas}`);

  const datosArbol = calcularDatosArbol(numHojas);
  console.log(`Datos del árbol: Bloques=${datosArbol.numBloques}, Bloque=${datosArbol.tamBloque}, Resto=${datosArbol.tamResto}`);

  const indiceArbol = calcularBloqueIndice(datosArbol.tamBloque, datosArbol.tamResto, indice);
  console.log(`Índice del árbol: Bloque=${indiceArbol.bloque}, Índice en bloque=${indiceArbol.bloqueIdx}`);

  if (!fs.existsSync(dirPruebaZK)) {
    fs.mkdirSync(dirPruebaZK, { recursive: true });
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const relPruebaZK = path.join('../../', CIRCUIT_DIR, `E-${eleccionId.toString().padStart(3, '0')}`);
  const dirPruebaZK = path.join(__dirname, relPruebaZK);
  console.log(`Directorio de prueba ZK: ${dirPruebaZK}`);

  const nuevaPruebaZK = {
    pruebaId: eleccionId,
    tamBloque: datosArbol.tamBloque,
    tamResto: datosArbol.tamResto,
    numBloques: datosArbol.numBloques,
    urlCircuito: path.join(relPruebaZK, 'merkle11.json'),
    ipfsCircuito: 'merkle11.json',
  };

  const resultadoPruebaZK = pruebaZKDAO.crear(bd, nuevaPruebaZK);
  console.log(`Prueba ZK creada con ID: ${resultadoPruebaZK.pruebaId}`);

  for (let bloque = 0, compromisoIdx = 0; bloque < datosArbol.numBloques; bloque++) {

    const tamBloque = (bloque < datosArbol.tamResto) ? datosArbol.tamBloque + 1 : datosArbol.tamBloque;

    console.log(`Procesando bloque ${bloque} con tamaño ${tamBloque}`);

    const registros = registroVotanteEleccionDAO.obtenerCompromisosEleccion(
      bd,
      eleccionId,
      compromisoIdx,
      tamBloque
    );

    console.log(`Número de registros obtenidos: ${registros.length}`);

    compromisoIdx += registros.length;

    const compromisos = registros.map(r => r.compromiso);
    const arbol = construirArbolPoseidon(compromisos);

    const archivoCompromisos = path.join(dirPruebaZK, `compromisos-bloque-${bloque}.json`);
    console.log(`Guardando compromisos en: ${archivoCompromisos}`);
    fs.writeFileSync(archivoCompromisos, JSON.stringify(compromisos, null, 2), 'utf8');

    const nuevaRaizZK = {
      pruebaId: eleccionId,
      bloqueIdx: bloque,
      urlCompromisos: `urlCompromisos-${bloque}`,
      ipfsCompromisos: `ipfsCompromisos-${bloque}`, 
      raiz: arbol.getRoot().toString('hex'),
      txIdRaiz: 'TEMPORAL',
    };

    const resultadoRaizZK = raizZKDAO.crear(bd, nuevaRaizZK);
    console.log(`Raíz ZK creada para el bloque ${bloque} con ID: ${JSON.stringify(resultadoRaizZK)}`);
  }

} catch (err) {
  console.error('Error creando raíces de elección:', err);
  process.exit(1);

} finally {
  cerrarConexionBD();
}

//-------------

async function preguntarUsuario(pregunta) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolver => {
    rl.question(pregunta, (respuesta) => {
      rl.close();
      resolver(respuesta.toLowerCase().startsWith('s'));
    });
  });
}


