import { BaseDAO } from './BaseDAO.js';

export class PartidoEleccionDAO extends BaseDAO {
  constructor() {
    super('PartidoEleccion');
  }

  async asignarPartidoEleccion(bd, partidoId, eleccionId) {
    return await this.crear(bd, { partidoId, eleccionId });
  }

  async eliminarPartidoEleccion(bd, partidoId, eleccionId) {
    return await bd.run(
      'DELETE FROM PartidoEleccion WHERE partidoId = ? AND eleccionId = ?',
      [partidoId, eleccionId]
    );
  }

  async obtenerPartidosEleccion(bd, eleccionId) {
    return await bd.all(
      `SELECT p.*, pe.eleccionId 
       FROM Partido p
       INNER JOIN PartidoEleccion pe ON p.siglas = pe.partidoId
       WHERE pe.eleccionId = ?`,
      [eleccionId]
    );
  }

  async obtenerEleccionesPartido(bd, partidoId) {
    return await bd.all(
      `SELECT e.*, pe.partidoId 
       FROM Eleccion e
       INNER JOIN PartidoEleccion pe ON e.id = pe.eleccionId
       WHERE pe.partidoId = ?`,
      [partidoId]
    );
  }
}