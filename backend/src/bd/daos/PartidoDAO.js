import { BaseDAO } from './BaseDAO.js';

export class PartidoDAO extends BaseDAO {
  constructor() {
    super('Partido');
  }

  async obtenerPorSiglas(db, siglas) {
    return await this.obtenerPorId(db, siglas, 'siglas');
  }

  async obtenerPorNombre(db, nombre) {
    return await db.get(
      'SELECT * FROM Partido WHERE nombre = ?',
      [nombre]
    );
  }

  async obtenerPorEleccion(db, eleccionId) {
    return await db.all(
      `SELECT p.* 
       FROM Partido p
       INNER JOIN PartidoEleccion pe ON p.siglas = pe.partidoId
       WHERE pe.eleccionId = ?`,
      [eleccionId]
    );
  }
}