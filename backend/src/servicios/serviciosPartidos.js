import { daos } from '../modelo/DAOs.js';

export const serviciosPartidos = {
  // Crear un partido
  async crear(bd, datosPartido) {
    return await daos.partido.crear(bd, datosPartido);
  },

  // Actualizar un partido
  async actualizar(bd, siglas, datosPartido) {
    return await daos.partido.actualizar(bd, { siglas }, datosPartido);
  },

  // Eliminar un partido
  async eliminar(bd, siglas) {
    return await daos.partido.eliminar(bd, { siglas });
  },

  // Obtener todos los partidos
  async obtenerTodos(bd) {
    return await daos.partido.obtenerTodos(bd);
  },

  // Obtener partido por siglas
  async obtenerPorSiglas(bd, siglas) {
    return await daos.partido.obtenerPorId(bd, { siglas });
  },

  // Obtener partidos por elección
  async obtenerPorEleccion(bd, eleccionId) {
    return await daos.partido.obtenerPorEleccion(bd, eleccionId);
  },

  // Asignar partido a elección
  async asignarPartidoEleccion(bd, partidoId, eleccionId) {
    return await daos.partidoEleccion.asignarPartidoEleccion(bd, partidoId, eleccionId);
  },

  // Eliminar partido de elección
  async eliminarPartidoEleccion(bd, partidoId, eleccionId) {
    return await daos.partidoEleccion.eliminarPartidoEleccion(bd, partidoId, eleccionId);
  },
};