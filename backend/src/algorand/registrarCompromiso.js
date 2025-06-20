// src/deployer/deployContract.js
import { votanteDAO, eleccionDAO, registroVotanteEleccionDAO } from '../bd/DAOs.js';

import { abrirRegistroCompromisos, cerrarRegistroCompromisos, registrarCompromiso } from './serviciosVoto3.js';

import { calcularSha256 } from '../utiles/utiles.js';

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

export async function abrirRegistroCompromisosEleccion(bd, { eleccionId, contratoId }) {

  console.log(`Abriendo registro de compromisos para la elección ${eleccionId} con contrato ${contratoId}`);

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

  if (resultadoLeerEstado === 1) {
    const resultadoAbrir = await abrirRegistroCompromisos(bd, { contratoId });
    console.log(`Registro de compromisos abierto para el contrato ${contratoId}: ${resultadoAbrir}`);

  } else if (resultadoLeerEstado === 2) {
    console.log(`El contrato ${contratoId} ya estaba abierto.`);

  } else {
    console.log(`El contrato ${contratoId} no está en estado ${resultadoLeerEstado} adecuando.`);
  }
}

//----------------------------------------------------------------------------

export async function cerrarRegistroCompromisosEleccion(bd, { eleccionId, contratoId }) {

  console.log(`Cerrando registro de compromisos para la elección ${eleccionId} con contrato ${contratoId}`);

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

  if (resultadoLeerEstado === 2) {
    const resultadoCerrar = await cerrarRegistroCompromisos(bd, { contratoId });
    console.log(`Registro de compromisos cerrado para el contrato ${contratoId}: ${resultadoCerrar}`);

  } else if (resultadoLeerEstado === 3) {
    console.log(`El contrato ${contratoId} ya estaba abierto.`);

  } else {
    console.log(`El contrato ${contratoId} no está en estado ${resultadoLeerEstado} adecuando.`);
  }
}

//----------------------------------------------------------------------------

export async function registrarVotanteEleccion(bd, { eleccionId, contratoId, votanteId, compromiso }) {

  console.log(`Registrando compromiso para ${eleccionId} del votante ${votanteId}`);
  console.log(`Compromiso: ${JSON.stringify(compromiso)}`);

  //-------------

  if (!contratoId && eleccionId) {
    const eleccion = eleccionDAO.obtenerPorId(bd, { id: eleccionId });
    contratoId = eleccion.contratoId;
  }

  if (!contratoId) {
    throw new Error(`No se ha proporcionado un contratoId para la elección ${eleccionId}`);
  }

  if (!votanteId) {
    throw new Error(`No se ha proporcionado un votanteId para la elección ${eleccionId}`);
  }

  const resultadoLeerEstado = await leerEstadoContrato(bd, { contratoId });
  console.log(`Estado del contrato ${contratoId}: ${resultadoLeerEstado}`);

  if (resultadoLeerEstado === 3) {

    const votante = votanteDAO.obtenerPorId(bd, { dni: votanteId });

    if (!votante) {
      throw new Error(`No se encontró el votante con DNI ${votanteId}`);
    }

    const registro = registroVotanteEleccionDAO.registrarVotanteEleccion(bd, {
      votanteId,
      eleccionId,
      compromiso
    });

    const dniHash = calcularSha256(JSON.stringify(compromiso));

    const compromisoNote = {
      idx: registro.compromisoIdx,
      dni: dniHash,
      compromiso,
    };

    const resultadoRegistrar = await registrarCompromiso(bd, { contratoId, compromisoNote });

    console.log(`Registro de compromisos cerrado para el contrato ${contratoId}: ${resultadoAbrir}`);

  } else {
    throw new Error(`El contrato ${contratoId} no está en estado ${resultadoLeerEstado} adecuando.`);
  }
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
