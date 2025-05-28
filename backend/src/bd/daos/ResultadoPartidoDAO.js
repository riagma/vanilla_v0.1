import { BaseDAO } from './BaseDAO.js';

export class ResultadoPartidoDAO extends BaseDAO {
  constructor() {
    super('ResultadoPartido');
  }

  async registrarResultado(db, partidoId, eleccionId, votos, porcentaje) {
    return await this.crear(db, {
      partidoId,
      eleccionId,
      votos,
      porcentaje
    });
  }

  async actualizarResultado(db, partidoId, eleccionId, votos, porcentaje) {
    return await db.run(
      `UPDATE ${this.nombreTabla} 
       SET votos = ?, porcentaje = ?
       WHERE partidoId = ? AND eleccionId = ?`,
      [votos, porcentaje, partidoId, eleccionId]
    );
  }

  async obtenerResultadosPorEleccion(db, eleccionId) {
    return await db.all(
      `SELECT rp.*, p.nombre as nombrePartido
       FROM ${this.nombreTabla} rp
       INNER JOIN Partido p ON rp.partidoId = p.siglas
       WHERE rp.eleccionId = ?
       ORDER BY rp.votos DESC`,
      [eleccionId]
    );
  }

  async obtenerResultadosPorPartido(db, partidoId) {
    return await db.all(
      `SELECT rp.*, e.nombre as nombreEleccion
       FROM ${this.nombreTabla} rp
       INNER JOIN Eleccion e ON rp.eleccionId = e.id
       WHERE rp.partidoId = ?
       ORDER BY e.fechaCelebracion DESC`,
      [partidoId]
    );
  }
}