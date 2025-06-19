import { BaseDAO } from './BaseDAO.js';

export class RegistroVotanteEleccionDAO extends BaseDAO {
  constructor() {
    super('RegistroVotanteEleccion');
  }

  obtenerPorEleccion(bd, eleccionId) {
    return bd.all(
      'SELECT * FROM RegistroVotanteEleccion WHERE eleccionId = ?'
    ).all([eleccionId]);
  }

  obtenerPorVotante(bd, votanteId) {
    return bd.all(
      'SELECT * FROM RegistroVotanteEleccion WHERE votanteId = ?'
    ).all([votanteId]);
  }
}