// src/deployer/deployContract.js
import { votanteDAO, eleccionDAO, anuladorZKDAO, contratoBlockchainDAO } from '../bd/DAOs.js';

import { 
  leerEstadoContrato,
  abrirRegistroAnuladores, 
  cerrarRegistroAnuladores, 
  registrarAnulador 

} from './serviciosVoto3.js';

import { calcularSha256 } from '../utiles/utilesCrypto.js';

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

export async function abrirRegistroAnuladoresEleccion(bd, eleccionId) {

  const contrato = contratoBlockchainDAO.obtenerPorId(bd, { contratoId: eleccionId });
  if (!contrato) {
    throw new Error(`No se encontró el contrato para la elección ${eleccionId}`);
  }

  const resultadoLeerEstado = await leerEstadoContrato(bd, { contratoId: eleccionId });
  console.log(`Estado de la elección ${eleccionId}: ${resultadoLeerEstado}`);

  if (resultadoLeerEstado === 5n) {
    console.log(`Abriendo registro de anuladores para la elección ${eleccionId}:${contrato.appId}`);
    const resultadoAbrir = await abrirRegistroAnuladores(bd, { contratoId: eleccionId });
    console.log(`Registro de anuladores abierto para la elección ${eleccionId}:${contrato.appId}`);

  } else if (resultadoLeerEstado === 6n) {
    console.log(`El registro de anuladores de la elección ${eleccionId} ya estaba abierto.`);

  } else {
    console.log(`La elección ${eleccionId}:${contrato.appId} no está en estado adecuado (5) != (${resultadoLeerEstado}).`);
  }
}

//----------------------------------------------------------------------------

export async function registrarAnuladorEleccion(bd, { eleccionId, anulador, destinatario }) {

  console.log(`Registrando ${anulador} y ${destinatario} para ${eleccionId}`);

  //-------------

  const contrato = contratoBlockchainDAO.obtenerPorId(bd, { contratoId: eleccionId });
  if (!contrato) {
    throw new Error(`No se encontró el contrato para la elección ${eleccionId}`);
  }

  const resultadoLeerEstado = await leerEstadoContrato(bd, { contratoId: eleccionId });
  console.log(`Estado de la elección ${eleccionId}: ${resultadoLeerEstado}`);

  if (resultadoLeerEstado === 6n) {

    anuladorZKDAO.crear(bd, {
      pruebaId,
      anulador,
      destinatario,
      registroTxId: 'TEMPORAL',
      papeletaTxId: 'TEMPORAL',
      votacionTxId: 'TEMPORAL',
    });

    const resultadoRegistrar = await registrarAnulador(bd, { 
      contratoId: eleccionId, 
      anulador,
      destinatario
    });

    anuladorZKDAO.actualizar(bd, { pruebaId, eleccionId }, { registroTxId: resultadoRegistrar.txId});

    console.log(`Anulador registrado en la elección ${eleccionId}: ${JSON.stringify(anuladorNote)}`);
    console.log(`Transacción registrada: ${resultadoRegistrar.txId}`);

  } else {
    console.log(`La elección ${eleccionId}:${contrato.appId} no está en estado adecuado (6) != (${resultadoLeerEstado}).`);
  }
}

//----------------------------------------------------------------------------

export async function solicitarPapeletaEleccion(bd, { eleccionId, anulador }) {

  console.log(`Registrando ${anulador} y ${destinatario} para ${eleccionId}`);

  //-------------

  const registroAnulador = anuladorZKDAO.obtenerPorId(bd, { pruebaId: eleccionId, anulador });
  
  if (!registroAnulador) {
    throw new Error(`No se encontró el registro del anulador ${anulador} para la elección ${eleccionId}`);
  }

  // Consume fees
  // const resultadoLeerEstado = await leerEstadoContrato(bd, { contratoId: eleccionId });
  // console.log(`Estado de la elección ${eleccionId}: ${resultadoLeerEstado}`);

  try {

    const anuladorNote = {
      anu: anulador,
      des: destinatario
    };

    const resultadoRegistrar = await registrarAnulador(bd, { 
      contratoId: eleccionId, 
      anulador: anuladorNote,
      destinatario
    });

    anuladorZKDAO.actualizar(bd, { pruebaId, eleccionId }, { registroTxId: resultadoRegistrar.txId});

    console.log(`Anulador registrado en la elección ${eleccionId}: ${JSON.stringify(anuladorNote)}`);
    console.log(`Transacción registrada: ${resultadoRegistrar.txId}`);

  } catch (Error) {
      // TODO: Buscar el assert o su descripción en el error
      console.error(`Error al registrar anulador en la elección ${eleccionId}:`, Error.message);
  }
}

//----------------------------------------------------------------------------

export async function cerrarRegistroAnuladoresEleccion(bd, eleccionId) {

  const contrato = contratoBlockchainDAO.obtenerPorId(bd, { contratoId: eleccionId });
  if (!contrato) {
    throw new Error(`No se encontró el contrato para la elección ${eleccionId}`);
  }

  const resultadoLeerEstado = await leerEstadoContrato(bd, { contratoId: eleccionId });
  console.log(`Estado de la elección ${eleccionId}: ${resultadoLeerEstado}`);

  if (resultadoLeerEstado === 6n) {
    console.log(`Cerrando registro de anuladores para la elección ${eleccionId}:${contrato.appId}`);
    const resultadoCerrar = await cerrarRegistroAnuladores(bd, { contratoId: eleccionId });
    console.log(`Registro de anuladores cerrado para la elección ${eleccionId}:${contrato.appId}`);

  } else if (resultadoLeerEstado === 7n) {
    console.log(`La elección ${eleccionId}:${contrato.appId} ya estaba cerrada.`);

  } else {
    console.log(`
      La elección ${eleccionId}:${contrato.appId} 
      no está en estado adecuado (6) != (${resultadoLeerEstado}).`);
  }
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
