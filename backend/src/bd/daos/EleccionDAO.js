import { BaseDAO } from './BaseDAO.js';

export class EleccionDAO extends BaseDAO {
  constructor() {
    super('Eleccion');
  }

  async obtenerActivas(db) {
    return await db.all(
      `SELECT * FROM ${this.nombreTabla} 
       WHERE estado = 'ACTIVA' 
       AND fechaFinVotacion > datetime('now')`
    );
  }

  async obtenerConPartidos(db, eleccionId) {
    return await db.all(
      `SELECT e.*, p.* 
       FROM Eleccion e
       LEFT JOIN PartidoEleccion pe ON e.id = pe.eleccionId
       LEFT JOIN Partido p ON pe.partidoId = p.siglas
       WHERE e.id = ?`,
      [eleccionId]
    );
  }
}