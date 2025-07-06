import { daos } from '../modelo/DAOs.js';

export const serviciosResultados = {
  // Operaciones para ResultadoEleccion

  async crearResultadoEleccion(bd, datosResultado) {
    return await daos.resultadoEleccion.crear(bd, datosResultado);
  },

  async actualizarResultadoEleccion(bd, idEleccion, datosResultado) {
    return await daos.resultadoEleccion.actualizar(bd, { idEleccion }, datosResultado);
  },

  async eliminarResultadoEleccion(bd, idEleccion) {
    return await daos.resultadoEleccion.eliminar(bd, { idEleccion });
  },

  async obtenerResultadoEleccion(bd, idEleccion) {
    return await daos.resultadoEleccion.obtenerPorEleccionId(bd, idEleccion);
  },

  // Operaciones para ResultadoPartido

  async crearResultadoPartido(bd, datosResultado) {
    return await daos.resultadoPartido.crear(bd, datosResultado);
  },

  async actualizarResultadoPartido(bd, idEleccion, partidoId, datosResultado) {
    return await daos.resultadoPartido.actualizar(bd, { idEleccion, partidoId }, datosResultado);
  },

  async eliminarResultadoPartido(bd, idEleccion, partidoId) {
    return await daos.resultadoPartido.eliminar(bd, { idEleccion, partidoId });
  },

  async obtenerResultadosPartidos(bd, idEleccion) {
    return await daos.resultadoPartido.obtenerPorEleccion(bd, idEleccion);
  },

  async obtenerResultadoPartido(bd, idEleccion, partidoId) {
    return await daos.resultadoPartido.obtenerPorId(bd, idEleccion, partidoId);
  }
};