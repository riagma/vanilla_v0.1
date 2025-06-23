// src/deployer/deployContract.js
import { votanteDAO, eleccionDAO, registroVotanteEleccionDAO, pruebaZKDAO, raizZKDAO } from '../bd/DAOs.js';

import {
  leerEstadoContrato,
  abrirRegistroRaices,
  cerrarRegistroRaices,
  registrarRaiz

} from './serviciosVoto3.js';

import { calcularSha256 } from '../utiles/utilesCrypto.js';

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

export async function abrirRegistroRaicesEleccion(bd, eleccionId) {

  console.log(`Abriendo registro de raices para la elección ${eleccionId}`);

  //-------------

  const eleccion = eleccionDAO.obtenerPorId(bd, { id: eleccionId });
  if (!eleccion) {
    throw new Error(`No se ha encontrado la elección con ID ${eleccionId}`);
  }

  const contratoId = eleccion.contratoId;
  if (!contratoId) {
    throw new Error(`No se ha encontrado un contratoId para la elección ${eleccionId}`);
  }

  const pruebaZK = pruebaZKDAO.obtenerPorId(bd, { pruebaId: eleccionId });
  if (!pruebaZK) {
    throw new Error(`No se ha encontrado una prueba ZK para la elección ${eleccionId}`);
  }

  const resultadoLeerEstado = await leerEstadoContrato(bd, { contratoId });
  console.log(`Estado del contrato ${contratoId}: ${resultadoLeerEstado}`);

  if (resultadoLeerEstado === 3n) {
    const resultadoAbrir = await abrirRegistroRaices(bd, {
      contratoId,
      bloquesZK: pruebaZK.tamBloque,
      restoZK: pruebaZK.tamResto,
    });
    console.log(`Registro de raices abierto para el contrato ${contratoId}: ${resultadoAbrir.txId}`);

  } else if (resultadoLeerEstado === 4n) {
    console.log(`El contrato ${contratoId} ya estaba abierto.`);

  } else {
    console.log(`El contrato ${contratoId} no está en estado ${resultadoLeerEstado} adecuando (4).`);
  }
}

//----------------------------------------------------------------------------

export async function cerrarRegistroRaicesEleccion(bd, { eleccionId, contratoId }) {

  console.log(`Cerrando registro de raices para la elección ${eleccionId} con contrato ${contratoId}`);

  //-------------

  if (!contratoId && eleccionId) {
    const eleccion = eleccionDAO.obtenerPorId(bd, { id: eleccionId });
    contratoId = eleccion.contratoId;
  }

  if (!contratoId) {
    throw new Error(`No se ha proporcionado un contratoId para la elección ${eleccionId}`);
  }

  const resultadoLeerEstado = await leerEstadoContrato(bd, { contratoId });
  console.log(`Estado del contrato ${contratoId}: ${resultadoLeerEstado}`);

  if (resultadoLeerEstado === 4n) {
    const resultadoCerrar = await cerrarRegistroRaices(bd, { contratoId });
    console.log(`Registro de raices cerrado para el contrato ${contratoId}: ${resultadoCerrar}`);

  } else if (resultadoLeerEstado === 5n) {
    console.log(`El contrato ${contratoId} ya estaba abierto.`);

  } else {
    console.log(`El contrato ${contratoId} no está en estado ${resultadoLeerEstado} adecuando.`);
  }
}

//----------------------------------------------------------------------------

export async function registrarRaicesEleccion(bd, { eleccionId }) {

  console.log(`Registrando raices para ${eleccionId}`);

  //-------------

  const eleccion = eleccionDAO.obtenerPorId(bd, { id: eleccionId });
  if (!eleccion) {
    throw new Error(`No se ha encontrado la elección con ID ${eleccionId}`);
  }

  const contratoId = eleccion.contratoId;
  if (!contratoId) {
    throw new Error(`No se ha encontrado un contratoId para la elección ${eleccionId}`);
  }

  const pruebaZK = pruebaZKDAO.obtenerPorId(bd, { pruebaId: eleccionId });
  if (!pruebaZK) {
    throw new Error(`No se ha encontrado una prueba ZK para la elección ${eleccionId}`);
  }

  const resultadoLeerEstado = await leerEstadoContrato(bd, { contratoId });
  console.log(`Estado del contrato ${contratoId}: ${resultadoLeerEstado}`);

  let txnId_1 = '';
  let txnId_10 = '';
  let txnId_100 = '';

  if (resultadoLeerEstado === 4n) {
    const raices = raizZKDAO.obtenerPorPruebaId(bd, eleccionId );

    for (let idx = raices.length - 1; idx >= 0; idx--) {

      const raiz = raices[idx];
      
      console.log(`Registrando raiz: ${raiz.bloqueIdx} - ${raiz.raiz}`);

      if (idx + 1 < raices.length) {
        txnId_1 = raices[idx + 1].txnId_0;
        console.log(raices[idx + 1]);
        console.log(typeof raices[idx + 1].txnId_0, raices[idx + 1].txnId_0);       
      }
      if (idx + 10 < raices.length) {
        txnId_10 = raices[idx + 10].txnId_0;
      }
      if (idx + 100 < raices.length) {
        txnId_100 = raices[idx + 100].txnId_0;
      }

      if (raiz.txnId_0 !== 'temporal') {

        const raizNote = {
          idx: raiz.bloqueIdx.toString(),
          raiz: raiz.raiz,
          ipfs: raiz.ipfsCompromisos,
          t1: txnId_1,
          t10: txnId_10,
          t100: txnId_100,
        };

        const resultadoRegistrar = await registrarRaiz(bd, { contratoId, raiz: raizNote });

        raiz.txnId_0 = resultadoRegistrar.txId;
        raiz.txnId_1 = txnId_1;
        raiz.txnId_10 = txnId_10;
        raiz.txnId_100 = txnId_100;

        raizZKDAO.actualizar(bd,
          {
            pruebaId: raiz.pruebaId,
            bloqueIdx: raiz.bloqueIdx,
          },
          {
            txnId_0: raiz.txnId_0,
            txnId_1: raiz.txnId_1,
            txnId_10: raiz.txnId_10,
            txnId_100: raiz.txnId_100,
          });
      }

      console.log(`Raiz registrada: ${raiz.txnId_0}`);
    }

  } else {
    throw new Error(`El contrato ${contratoId} no está en estado ${resultadoLeerEstado} adecuando.`);
  }
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
