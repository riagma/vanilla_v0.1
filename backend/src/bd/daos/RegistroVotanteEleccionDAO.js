import { BaseDAO } from './BaseDAO.js';

export class RegistroVotanteEleccionDAO extends BaseDAO {
  constructor() {
    super('RegistroVotanteEleccion');
  }

  async registrarVotante(db, votanteId, eleccionId, compromiso, transaccion, datosPrivados = null) {
    return await this.crear(db, {
      votanteId,
      eleccionId,
      compromiso,
      transaccion,
      datosPrivados,
      fechaRegistro: new Date().toISOString()
    });
  }

  async obtenerRegistroPorVotanteYEleccion(db, votanteId, eleccionId) {
    return await db.get(
      `SELECT * FROM ${this.nombreTabla} 
       WHERE votanteId = ? AND eleccionId = ?`,
      [votanteId, eleccionId]
    );
  }

  async obtenerRegistrosPorEleccion(db, eleccionId) {
    return await db.all(
      `SELECT r.*, v.nombre, v.primerApellido, v.segundoApellido 
       FROM ${this.nombreTabla} r
       INNER JOIN Votante v ON r.votanteId = v.dni
       WHERE r.eleccionId = ?`,
      [eleccionId]
    );
  }

  async contarRegistrosPorEleccion(db, eleccionId) {
    const resultado = await db.get(
      `SELECT COUNT(*) as total FROM ${this.nombreTabla} 
       WHERE eleccionId = ?`,
      [eleccionId]
    );
    return resultado.total;
  }
}