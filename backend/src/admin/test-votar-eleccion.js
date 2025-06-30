#!/usr/bin/env node
import { algorand } from '../algorand/algorand.js';
import { toNote } from '../algorand/algoUtiles.js';
import { abrirConexionBD, cerrarConexionBD } from '../bd/BD.js';
import { contratoBlockchainDAO, registroVotanteEleccionDAO, eleccionDAO, partidoDAO } from '../bd/DAOs.js';
import { solicitarPapeletaEleccion } from '../algorand/registrarAnuladores.js';

import {
  encriptar,
  desencriptar,
  desencriptarJSON, 
  generarParClavesRSA,
  encriptarConClavePublica,
  desencriptarConClavePrivada } from '../utiles/utilesCrypto.js';

import { CLAVE_MAESTRA, CLAVE_PRUEBAS } from '../utiles/constantes.js';

//--------------

const eleccionId = process.argv[2] ? parseInt(process.argv[2]) : undefined;
const numeroVotos = process.argv[3] ? parseInt(process.argv[3]) : 100;

if (!eleccionId) {
  console.error(`Uso: node ${process.argv[1]} <elección-id> <número-votos>?`);
  process.exit(1);
}

//----------------------------------------------------------------------------

let partidos = null
let pesos = []

function elegirPartido(bd, eleccionId) {

  if(!partidos) {
    partidos = partidoDAO.obtenerPorEleccion(bd, eleccionId );
    let sumaPesos = 0;
    for (const partido of partidos) {
      const peso = Math.random();
      pesos.push(peso);
      sumaPesos += peso; 
    }
    pesos = pesos.map(peso => peso / sumaPesos);
  } 

  const r = Math.random();
  
  let acumulado = 0;
  for (let i = 0; i < partidos.length; i++) {
    acumulado += pesos[i];
    if (r < acumulado) return partidos[i];
  }
  return partidos[partidos.length - 1];
}

//----------------------------------------------------------------------------

async function tienePapeleta(assetId, cuentaAddr) {

  const accountInfo = await algorand.asset.getAccountInformation(cuentaAddr, assetId);
  // console.log(accountInfo);

  return accountInfo.balance > 0n;
}

//----------------------------------------------------------------------------

async function votar(mnemonico, appAddr, assetId, voto) {

  const cuenta = algorand.account.fromMnemonic(mnemonico);

  const resultadoTransfer = await algorand.send.assetTransfer(
    {
      sender: cuenta.addr,
      assetId: BigInt(assetId),
      amount: 1n,
      receiver: appAddr,
      signer: cuenta.signer,
      note: toNote(voto),
    },
    {
      skipWaiting: false,
      skipSimulate: true,
      maxRoundsToWaitForConfirmation: 12,
      maxFee: (2000).microAlgos(),
    }
  );

  // console.log(resultadoTransfer);

  return resultadoTransfer
}

//----------------------------------------------------------------------------

try {

  const bd = abrirConexionBD();

  const eleccion = eleccionDAO.obtenerPorId(bd, { id: eleccionId });
  if (!eleccion) {
    throw new Error(`No se encontró la elección con ID ${eleccionId}`);
  }

  // console.log(eleccion);

  if (!eleccion.claveVotoPublica || !eleccion.claveVotoPrivada ) {
    const { clavePublica, clavePrivada } = await generarParClavesRSA();
    const clavePrivadaEncriptada = await encriptar(clavePrivada, CLAVE_MAESTRA);
    eleccion.claveVotoPublica = clavePublica;
    eleccion.claveVotoPrivada = clavePrivadaEncriptada;
    eleccionDAO.actualizar(bd, { id: eleccionId }, { 
      claveVotoPublica: clavePublica, 
      claveVotoPrivada: clavePrivadaEncriptada 
    });
  }

  // const clavePrivadaDesencriptada = await desencriptar(eleccion.claveVotoPrivada, CLAVE_MAESTRA);

  // console.log(eleccion.claveVotoPublica);
  // console.log(clavePrivadaDesencriptada);

  // const textoPrueba = `Prueba de votación para la elección ${eleccionId}`;

  // const textoCifrado = await encriptarConClavePublica(textoPrueba, eleccion.claveVotoPublica);
  // console.log(`Texto cifrado: ${textoCifrado.length} caracteres`);
  // const textoDescifrado = await desencriptarConClavePrivada(textoCifrado, clavePrivadaDesencriptada);
  // console.log(`Texto descifrado: ${textoDescifrado}`);

  const contrato = contratoBlockchainDAO.obtenerPorId(bd, { contratoId: eleccionId });
  if (!contrato) {
    throw new Error(`No se encontró el contrato para la elección ${eleccionId}`);
  }

  // console.log(contrato);

//--------------
  // console.log = function () {}; // Desactiva console.log para evitar demasiada salida
//--------------

  let contadorVotos = 0;
  let compromisoIdx = 0;

  while (contadorVotos < numeroVotos) {

    const votantesRegistrados = registroVotanteEleccionDAO.obtenerVotantesEleccion(bd,
      {
        eleccionId,
        compromisoIdx
      });

    if (!votantesRegistrados || votantesRegistrados.length === 0) {
      console.log(`No hay votantes registrados para la elección ${eleccionId} con compromisoIdx ${compromisoIdx}.`);
      break;
    }

    compromisoIdx += votantesRegistrados.length;
    
    for (let idx = 0; idx < votantesRegistrados.length && contadorVotos < numeroVotos; idx++) {

      const registroVotante = votantesRegistrados[idx];

      const datosPrivados = await desencriptarJSON(registroVotante.datosPrivados, CLAVE_PRUEBAS);

      // console.log(`Datos privados del votante ${registroVotante.votanteId}:`, datosPrivados);

      if(await tienePapeleta(contrato.tokenId, datosPrivados.cuentaAddr)) {

        console.log(`Votando ${registroVotante.votanteId} en la elección ${eleccionId}.`);

        const partidoElegido = elegirPartido(bd, eleccionId);

        // console.log('Partido elegido: ', partidoElegido);

        const valorVoto = {
          siglas: partidoElegido.siglas,
          nonce: randomBytes(16).toString('hex')
        };

        const voto = { voto: await encriptarConClavePublica(JSON.stringify(valorVoto)) };

        // console.log(`Voto cifrado: ${voto.voto}`);

        await votar(
          datosPrivados.cuentaMnemonic, 
          contrato.appAddr, 
          contrato.tokenId, voto);

        contadorVotos++;
      }
    }
  }

} catch (err) {
  console.error('Error en el test de votaciones:', err);
  process.exit(1);

} finally {
  cerrarConexionBD();
}

process.exit(0);


