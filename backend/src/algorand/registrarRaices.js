// src/deployer/deployContract.js
import { votanteDAO, eleccionDAO, registroVotanteEleccionDAO } from '../bd/DAOs.js';

import { 
  leerEstadoContrato,
  abrirRegistroRaices, 
  cerrarRegistroRaices, 
  registrarRaiz 

} from './serviciosVoto3.js';

import { calcularSha256 } from '../utiles/utiles.js';

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

export async function abrirRegistroRaicesEleccion(bd, { eleccionId, contratoId }) {

  console.log(`Abriendo registro de raices para la elección ${eleccionId} con contrato ${contratoId}`);

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

  if (resultadoLeerEstado === 3n) {
    const resultadoAbrir = await abrirRegistroRaices(bd, { contratoId });
    console.log(`Registro de raices abierto para el contrato ${contratoId}: ${resultadoAbrir.txId}`);

  } else if (resultadoLeerEstado === 4n) {
    console.log(`El contrato ${contratoId} ya estaba abierto.`);

  } else {
    console.log(`El contrato ${contratoId} no está en estado ${resultadoLeerEstado} adecuando (1).`);
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

export async function registrarRaizEleccion(bd, { eleccionId, contratoId, votanteId, raiz }) {

  console.log(`Registrando raiz para ${eleccionId} del votante ${votanteId}`);
  console.log(`Raiz: ${JSON.stringify(raiz)}`);

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

  if (resultadoLeerEstado === 2n) {

    const votante = votanteDAO.obtenerPorId(bd, { dni: votanteId });

    if (!votante) {
      throw new Error(`No se encontró el votante con DNI ${votanteId}`);
    }

    const registro = registroVotanteEleccionDAO.registrarRaizEleccion(bd, {
      votanteId,
      eleccionId,
      raiz
    });

    const dniHash = calcularSha256(JSON.stringify(raiz));

    const raizNote = {
      idx: registro.raizIdx,
      dni: dniHash,
      raiz,
    };

    const resultadoRegistrar = await registrarRaiz(bd, { contratoId, raiz: raizNote });

    registroVotanteEleccionDAO.actualizarTransaccion(bd, {
      votanteId,
      eleccionId,
      transaccion: resultadoRegistrar.txId
    });

    console.log(`Raiz registrado para el votante ${votanteId} en la elección ${eleccionId}: ${JSON.stringify(raizNote)}`);
    console.log(`Transacción registrada: ${resultadoRegistrar.txId}`);

  } else {
    throw new Error(`El contrato ${contratoId} no está en estado ${resultadoLeerEstado} adecuando.`);
  }
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
