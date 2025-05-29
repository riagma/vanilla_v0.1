import { BaseDAO } from './BaseDAO.js';

export class PartidoDAO extends BaseDAO {
  constructor() {
    super('Partido');
  }

  async obtenerPorSiglas(bd, siglas) {
    return await this.obtenerPorId(bd, siglas, 'siglas');
  }

  async obtenerPorNombre(bd, nombre) {
    return await bd.get(
      'SELECT * FROM Partido WHERE nombre = ?',
      [nombre]
    );
  }

  async obtenerPorEleccion(bd, eleccionId) {
    return await bd.all(
      `SELECT p.* 
       FROM Partido p
       INNER JOIN PartidoEleccion pe ON p.siglas = pe.partidoId
       WHERE pe.eleccionId = ?`,
      [eleccionId]
    );
  }
}