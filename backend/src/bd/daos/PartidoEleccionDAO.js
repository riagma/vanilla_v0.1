import { BaseDAO } from './BaseDAO.js';

export class PartidoEleccionDAO extends BaseDAO {
  constructor() {
    super('PartidoEleccion');
  }

  async asignarPartidoAEleccion(db, partidoId, eleccionId) {
    return await this.crear(db, { partidoId, eleccionId });
  }

  async eliminarPartidoDeEleccion(db, partidoId, eleccionId) {
    return await db.run(
      'DELETE FROM PartidoEleccion WHERE partidoId = ? AND eleccionId = ?',
      [partidoId, eleccionId]
    );
  }

  async obtenerPartidosPorEleccion(db, eleccionId) {
    return await db.all(
      `SELECT p.*, pe.eleccionId 
       FROM Partido p
       INNER JOIN PartidoEleccion pe ON p.siglas = pe.partidoId
       WHERE pe.eleccionId = ?`,
      [eleccionId]
    );
  }

  async obtenerEleccionesPorPartido(db, partidoId) {
    return await db.all(
      `SELECT e.*, pe.partidoId 
       FROM Eleccion e
       INNER JOIN PartidoEleccion pe ON e.id = pe.eleccionId
       WHERE pe.partidoId = ?`,
      [partidoId]
    );
  }
}