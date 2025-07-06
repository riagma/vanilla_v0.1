import { contratoBlockchainDAO, daos, eleccionDAO, pruebaZKDAO, registroVotanteEleccionDAO } from '../modelo/DAOs.js';
import { DatosVotanteEleccion } from '../tipos/DatosVotanteEleccion.js';

export const serviciosRegistros = {

  // Obtener registro por DNI y elección
  obtenerRegistroVotanteEleccion(bd, votanteId, eleccionId) {
    console.log(`Obteniendo registro de votante ${votanteId} para elección ${eleccionId}`);

    const eleccion = eleccionDAO.obtenerPorId(bd, { id: eleccionId });
    if (!eleccion) {
      console.log(`Elección no encontrada: ${eleccionId}`);
      return null;
    }
    const registro = registroVotanteEleccionDAO.obtenerPorId(bd, { votanteId, eleccionId });
    if (!registro) {
      console.log(`Registro no encontrado para votante ${votanteId} en elección ${eleccionId}`);
      return null;
    }

    const datosVotanteEleccion = new DatosVotanteEleccion({ votanteId, eleccionId });

    datosVotanteEleccion.compromiso = registro.compromiso;
    datosVotanteEleccion.compromisoIdx = registro.compromisoIdx;
    datosVotanteEleccion.compromisoTxId = registro.compromisoTxId;
    datosVotanteEleccion.datosPrivados = registro.datosPrivados;

    const contrato = contratoBlockchainDAO.obtenerPorId(bd, { contratoId: eleccionId });

    if (contrato) {
      datosVotanteEleccion.appId = contrato.appId;
      datosVotanteEleccion.appAddr = contrato.appAddr;
      datosVotanteEleccion.tokenId = contrato.tokenId;
    }

    return datosVotanteEleccion;
  },

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------

  // Crear un registro de votante en elección
  async crear(bd, datosRegistro) {
    return await daos.registroVotanteEleccion.crear(bd, datosRegistro);
  },

  // Actualizar un registro de votante en elección
  async actualizar(bd, votanteId, eleccionId, datosRegistro) {
    return await daos.registroVotanteEleccion.actualizar(bd, { votanteId, eleccionId }, datosRegistro);
  },

  // Eliminar un registro de votante en elección
  async eliminar(bd, votanteId, eleccionId) {
    return await daos.registroVotanteEleccion.eliminar(bd, { votanteId, eleccionId });
  },

  // Obtener todos los registros
  async obtenerTodos(bd) {
    return await daos.registroVotanteEleccion.obtenerTodos(bd);
  },

  // Obtener registros por elección
  async obtenerPorEleccion(bd, eleccionId) {
    return await daos.registroVotanteEleccion.obtenerPorEleccion(bd, eleccionId);
  },

  // Obtener registros por votante
  async obtenerPorVotante(bd, votanteId) {
    return await daos.registroVotanteEleccion.obtenerPorVotante(bd, votanteId);
  }
};