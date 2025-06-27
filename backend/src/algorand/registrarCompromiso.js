// src/deployer/deployContract.js
import { votanteDAO, eleccionDAO, registroVotanteEleccionDAO, contratoBlockchainDAO } from '../bd/DAOs.js';

import { 
  leerEstadoContrato,
  abrirRegistroCompromisos, 
  cerrarRegistroCompromisos, 
  registrarCompromiso 

} from './serviciosVoto3.js';

import { calcularSha256 } from '../utiles/utilesCrypto.js';

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

export async function abrirRegistroCompromisosEleccion(bd, eleccionId) {

  const contrato = contratoBlockchainDAO.obtenerPorId(bd, { contratoId: eleccionId });
  if (!contrato) {
    throw new Error(`No se encontró el contrato para la elección ${eleccionId}`);
  }

  const resultadoLeerEstado = await leerEstadoContrato(bd, { contratoId: eleccionId });
  console.log(`Estado de la elección ${eleccionId}: ${resultadoLeerEstado}`);

  if (resultadoLeerEstado === 1n) {
    console.log(`Abriendo registro de compromisos para la elección ${eleccionId}:${contrato.appId}`);
    const resultadoAbrir = await abrirRegistroCompromisos(bd, { contratoId: eleccionId });
    console.log(`Registro de compromisos abierto para la elección ${eleccionId}:${contrato.appId}`);

  } else if (resultadoLeerEstado === 2n) {
    console.log(`La elección ${eleccionId} ya estaba abierta.`);

  } else {
    console.log(`La elección ${eleccionId}:${contrato.appId} no está en estado adecuado (1) != (${resultadoLeerEstado}).`);
  }
}

//----------------------------------------------------------------------------

export async function registrarVotanteEleccion(bd, { votanteId, eleccionId, compromiso, datosPrivados = null }) {

  console.log(`Registrando ${compromiso} para ${eleccionId} del votante ${votanteId}`);

  //-------------

  const contrato = contratoBlockchainDAO.obtenerPorId(bd, { contratoId: eleccionId });
  if (!contrato) {
    throw new Error(`No se encontró el contrato para la elección ${eleccionId}`);
  }

  const resultadoLeerEstado = await leerEstadoContrato(bd, { contratoId: eleccionId });
  console.log(`Estado de la elección ${eleccionId}: ${resultadoLeerEstado}`);

  if (resultadoLeerEstado === 2n) {

    const votante = votanteDAO.obtenerPorId(bd, { dni: votanteId });

    if (!votante) {
      throw new Error(`No se encontró el votante con DNI ${votanteId}`);
    }

    const registro = registroVotanteEleccionDAO.registrarVotanteEleccion(bd, {
      votanteId,
      eleccionId,
      compromiso,
      datosPrivados
    });

    const compromisoNote = {
      idx: registro.compromisoIdx,
      txp: registro.compromisoTxId,
      dni: calcularSha256(votanteId),
      cpm: compromiso,
    };

    const resultadoRegistrar = await registrarCompromiso(bd, { 
      contratoId: eleccionId, 
      compromiso: compromisoNote 
    });

    registroVotanteEleccionDAO.actualizarTransaccion(bd, {
      votanteId,
      eleccionId,
      compromisoTxId: resultadoRegistrar.txId
    });

    console.log(`Compromiso registrado para el votante ${votanteId} en la elección ${eleccionId}: ${JSON.stringify(compromisoNote)}`);
    console.log(`Transacción registrada: ${resultadoRegistrar.txId}`);

  } else {
    console.log(`La elección ${eleccionId}:${contrato.appId} no está en estado adecuado (2) != (${resultadoLeerEstado}).`);
  }
}

//----------------------------------------------------------------------------

export async function cerrarRegistroCompromisosEleccion(bd, eleccionId) {

  const contrato = contratoBlockchainDAO.obtenerPorId(bd, { contratoId: eleccionId });
  if (!contrato) {
    throw new Error(`No se encontró el contrato para la elección ${eleccionId}`);
  }

  const resultadoLeerEstado = await leerEstadoContrato(bd, { contratoId: eleccionId });
  console.log(`Estado de la elección ${eleccionId}: ${resultadoLeerEstado}`);

  if (resultadoLeerEstado === 2n) {
    console.log(`Cerrando registro de compromisos para la elección ${eleccionId}:${contrato.appId}`);
    const resultadoCerrar = await cerrarRegistroCompromisos(bd, { contratoId: eleccionId });
    console.log(`Registro de compromisos cerrado para la elección ${eleccionId}:${contrato.appId}`);

  } else if (resultadoLeerEstado === 3n) {
    console.log(`La elección ${eleccionId}:${contrato.appId} ya estaba cerrada.`);

  } else {
    console.log(`
      La elección ${eleccionId}:${contrato.appId} 
      no está en estado adecuado (2) != (${resultadoLeerEstado}).`);
  }
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
