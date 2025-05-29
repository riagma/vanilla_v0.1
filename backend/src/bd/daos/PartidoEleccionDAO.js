import { BaseDAO } from './BaseDAO.js';

export class PartidoEleccionDAO extends BaseDAO {
  constructor() {
    super('PartidoEleccion');
  }

  async asignarPartidoAEleccion(bd, partidoId, eleccionId) {
    return await this.crear(bd, { partidoId, eleccionId });
  }

  async eliminarPartidoDeEleccion(bd, partidoId, eleccionId) {
    return await bd.run(
      'DELETE FROM PartidoEleccion WHERE partidoId = ? AND eleccionId = ?',
      [partidoId, eleccionId]
    );
  }

  async obtenerPartidosPorEleccion(bd, eleccionId) {
    return await bd.all(
      `SELECT p.*, pe.eleccionId 
       FROM Partido p
       INNER JOIN PartidoEleccion pe ON p.siglas = pe.partidoId
       WHERE pe.eleccionId = ?`,
      [eleccionId]
    );
  }

  async obtenerEleccionesPorPartido(bd, partidoId) {
    return await bd.all(
      `SELECT e.*, pe.partidoId 
       FROM Eleccion e
       INNER JOIN PartidoEleccion pe ON e.id = pe.eleccionId
       WHERE pe.partidoId = ?`,
      [partidoId]
    );
  }
}