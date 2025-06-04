import { daos } from '../bd/daos.js';

export const serviciosRegistros = {
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

  // Obtener registro por DNI y elección
  async obtenerPorId(bd, votanteId, eleccionId) {
    return await daos.registroVotanteEleccion.obtenerPorId(bd, { votanteId, eleccionId });
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