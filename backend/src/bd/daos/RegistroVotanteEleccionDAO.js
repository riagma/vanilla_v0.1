import { BaseDAO } from './BaseDAO.js';

export class RegistroVotanteEleccionDAO extends BaseDAO {
  constructor() {
    super('RegistroVotanteEleccion');
  }

  async obtenerPorEleccion(bd, eleccionId) {
    return await bd.all(
      `SELECT r.*, v.nombre, v.primerApellido, v.segundoApellido 
       FROM ${this.nombreTabla} r
       INNER JOIN Votante v ON r.votanteId = v.dni
       WHERE r.eleccionId = ?`,
      [eleccionId]
    );
  }

  async contarPorEleccion(bd, eleccionId) {
    const resultado = await bd.get(
      `SELECT COUNT(*) as total FROM ${this.nombreTabla} 
       WHERE eleccionId = ?`,
      [eleccionId]
    );
    return resultado.total;
  }
}