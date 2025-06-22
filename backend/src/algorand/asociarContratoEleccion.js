// src/deployer/deployContract.js
import { contratoBlockchainDAO, eleccionDAO } from '../bd/DAOs.js';

import { algorand } from './algorand.js';
import { establecerClienteVoto3, inicializarEleccion, leerEstadoContrato } from './serviciosVoto3.js';

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

export async function asociarContratoEleccion(bd, contratoId, eleccionId) {

  console.log(`Asociando contrato ${contratoId} a elección ${eleccionId}`);

  //-------------

  // const { sender } = await establecerClienteVoto3(bd, { contratoId });

  // const contrato = contratoBlockchainDAO.obtenerPorId(bd, { contratoId });

  const resultadoLeerEstado = await leerEstadoContrato(bd, { contratoId });
  console.log(`Estado del contrato ${contratoId}: ${resultadoLeerEstado}`);

  if (resultadoLeerEstado === 0n) {

    const resultadoInicializacion = await inicializarEleccion(bd, {
      contratoId,
      nombreToken: 'VOTO3',
      nombreUnidades: 'VT3',
      numeroUnidades: BigInt(100000000),
    });

    console.log(`Elección inicializada con éxito: ${resultadoInicializacion}`);
  }

  //--------------

  const resultado = eleccionDAO.actualizarContratoEleccion(bd, eleccionId, contratoId);

  if (resultado !== 1) {
    throw new Error(`No se pudo asociar el contrato ${contratoId} a la elección ${eleccionId}`);
  }

  console.log(`Contrato ${contratoId} asociado a la elección ${eleccionId} con éxito.`);
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
