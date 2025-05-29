import { BaseDAO } from './BaseDAO.js';

export class RegistroVotanteEleccionDAO extends BaseDAO {
  constructor() {
    super('RegistroVotanteEleccion');
  }

  async registrarVotante(bd, votanteId, eleccionId, compromiso, transaccion, datosPrivados = null) {
    return await this.crear(bd, {
      votanteId,
      eleccionId,
      compromiso,
      transaccion,
      datosPrivados,
      fechaRegistro: new Date().toISOString()
    });
  }

  async obtenerRegistroPorVotanteYEleccion(bd, votanteId, eleccionId) {
    return await bd.get(
      `SELECT * FROM ${this.nombreTabla} 
       WHERE votanteId = ? AND eleccionId = ?`,
      [votanteId, eleccionId]
    );
  }

  async obtenerRegistrosPorEleccion(bd, eleccionId) {
    return await bd.all(
      `SELECT r.*, v.nombre, v.primerApellido, v.segundoApellido 
       FROM ${this.nombreTabla} r
       INNER JOIN Votante v ON r.votanteId = v.dni
       WHERE r.eleccionId = ?`,
      [eleccionId]
    );
  }

  async contarRegistrosPorEleccion(bd, eleccionId) {
    const resultado = await bd.get(
      `SELECT COUNT(*) as total FROM ${this.nombreTabla} 
       WHERE eleccionId = ?`,
      [eleccionId]
    );
    return resultado.total;
  }
}