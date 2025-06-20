import e from 'express';
import { BaseDAO } from './BaseDAO.js';

export class RegistroVotanteEleccionDAO extends BaseDAO {
  constructor() {
    super('RegistroVotanteEleccion');
  }

  obtenerPorEleccion(bd, eleccionId) {
    return bd.prepare(
      'SELECT * FROM RegistroVotanteEleccion WHERE eleccionId = ?'
    ).all([eleccionId]);
  }

  obtenerPorVotante(bd, votanteId) {
    return bd.prepare(
      'SELECT * FROM RegistroVotanteEleccion WHERE votanteId = ?'
    ).all([votanteId]);
  }

  registrarVotanteEleccion(bd, { eleccionId, votanteId, compromiso }) {

    const registrarVotante = db.transaction(({ eleccionId, votanteId, compromiso }) => {

      const { nuevo_idx } = db.prepare(`
          
        SELECT COALESCE(MAX(compromisoIdx), 0) + 1 AS nuevo_idx 
        FROM RegistroVotanteEleccion
        WHERE eleccionId = ?
        
      `).get(eleccionId);

      const registro = {
        votanteId,
        eleccionId,
        compromiso,
        compromisoIdx: nuevo_idx,
        transaccion: 'temporal',
        fechaRegistro: new Date().toISOString(),
        datosPrivados: null
      };

      this.crear(bd, registro);

      return registro;
    });

    return registrarVotante({ eleccionId, votanteId, compromiso });
  }
}