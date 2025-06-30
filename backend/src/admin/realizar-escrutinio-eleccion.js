#!/usr/bin/env node
import { indexer } from '../algorand/algorand.js';
import { toNote, fromNote } from '../algorand/algoUtiles.js';
import { 
  eleccionDAO, 
  contratoBlockchainDAO, 
  resultadoEleccionDAO, 
  partidoEleccionDAO,
  resultadoPartidoDAO
} from '../bd/DAOs.js';

import { desencriptar, desencriptarConClavePrivada } from '../utiles/utilesCrypto.js';

import { abrirConexionBD, cerrarConexionBD } from '../bd/BD.js';
import { TextDecoder, TextEncoder } from 'node:util';

import { CLAVE_MAESTRA } from '../utiles/constantes.js';


const codificador = new TextEncoder();
const decodificador = new TextDecoder();

const eleccionId = process.argv[2];

if (!eleccionId) {
  console.error(`Uso: node ${process.argv[1]} <elección-id>`);
  process.exit(1);
}

function crearResultadosEleccion(bd, eleccionId) {

  let resultadosEleccion = resultadoEleccionDAO.obtenerPorId(bd, { eleccionId });

  if (!resultadosEleccion) {

    resultadosEleccion = {
      eleccionId,
      censados: 0,
      votantes: 0,
      abstenciones: 0,
      votosBlancos: 0,
      votosNulos: 0,
      fechaRecuento: new Date().toISOString()
    };

    resultadoEleccionDAO.crear(bd, resultadosEleccion);

  } else {

    resultadosEleccion.censados = 0;
    resultadosEleccion.votantes = 0;
    resultadosEleccion.abstenciones = 0;
    resultadosEleccion.votosBlancos = 0;
    resultadosEleccion.votosNulos = 0;
    resultadosEleccion.fechaRecuento = new Date().toISOString();
  }

  return resultadosEleccion;
}

function crearResultadosPartidos(bd, eleccionId) {

  const resultadosPartidos = new Map();

  const partidos = partidoEleccionDAO.obtenerPartidosEleccion(bd, eleccionId);

  // console.log(partidos);

  for (const partido of partidos) {

    let resultadosPartido = resultadoPartidoDAO.obtenerPorId(bd, { eleccionId });

    if (!resultadosPartido) {

      resultadosPartido = {
        partidoId: partido.siglas,
        eleccionId,
        votos: 0,
        porcentaje: 0
      };

      // console.log(resultadosPartido);

      resultadoPartidoDAO.crear(bd, resultadosPartido);

    } else {
      resultadosPartido.votos = 0;
      resultadosPartido.porcentaje = 0;
    }

    resultadosPartidos.set(partido.partidoId, resultadosPartido);
  }

  return resultadosPartidos
}

try {

  const bd = abrirConexionBD();

  const eleccion = eleccionDAO.obtenerPorId(bd, { id: eleccionId });
  if (!eleccion) {
    throw new Error(`No se encontró la elección con ID ${eleccionId}`);
  }

  console.log(eleccion.nombre);

  const clavePrivada = await desencriptar(eleccion.claveVotoPrivada, CLAVE_MAESTRA);
  console.log(`Clave privada desencriptada: ${clavePrivada}`);

  const contrato = contratoBlockchainDAO.obtenerPorId(bd, { contratoId: eleccionId });
  if (!contrato) {
    throw new Error(`No se encontró el contrato para la elección ${eleccionId}`);
  }

  console.log(contrato);

  const resultadosEleccion = crearResultadosEleccion(bd, eleccionId);
  const resultadosPartidos = crearResultadosPartidos(bd, eleccionId);

  const prefijoNota = codificador.encode('{"voto":');

  let nextToken = undefined;

  do {
    const response = await indexer
      .lookupAssetTransactions(contrato.tokenId)
      .address(contrato.appAddr)
      .notePrefix(prefijoNota)
      .minRound(contrato.rondaInicialAnuladores)
      .limit(1000)
      .nextToken(nextToken) 
      .do();

    console.log(`Transacciones encontradas: ${response.transactions.length}`);

    for (const txn of response.transactions) {
      const nota = fromNote(txn.note);
      // const votoDesencriptado = await desencriptarConClavePrivada(nota.voto, clavePrivada);
      const votoDesencriptado = await desencriptar(nota.voto, CLAVE_MAESTRA);
      console.log(`Transacción: ${txn.id} -> ${votoDesencriptado}`);
    }
    
    nextToken = response.nextToken? response.nextToken : undefined;

  } while (nextToken);


} catch (err) {
  console.error('Error cerrando el registro de raíces:', err);
  process.exit(1);

} finally {
  cerrarConexionBD();
}

