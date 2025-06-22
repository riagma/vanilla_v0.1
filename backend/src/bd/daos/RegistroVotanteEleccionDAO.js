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

  obtenerSiguienteIdx(bd, votanteId) {
    return bd.prepare(`
      SELECT COALESCE(MAX(compromisoIdx), -1) + 1 AS nuevo_idx 
      FROM RegistroVotanteEleccion
      WHERE eleccionId = ?
    `).get(eleccionId);
  }

  registrarVotanteEleccion(bd, { eleccionId, votanteId, compromiso }) {

    const registrarVotante = bd.transaction((eleccionId, votanteId, compromiso) => {
      const siguienteIdx = this.obtenerSiguienteIdx(bd, votanteId);

      const registro = {
        votanteId,
        eleccionId,
        compromiso,
        compromisoIdx: siguienteIdx,
        transaccion: 'temporal',
        fechaRegistro: new Date().toISOString(),
        datosPrivados: null
      };

      console.log(registro);

      this.crear(bd, registro);

      return registro;
    });

    return registrarVotante(eleccionId, votanteId, compromiso);
  }

  actualizarTransaccion(bd, { eleccionId, votanteId, transaccion }) {

    const actualizarTransaccionStmt = bd.transaction((eleccionId, votanteId, transaccion) => {

      const registro = this.obtenerPorId(bd, { votanteId, eleccionId });

      if (!registro) {
        throw new Error(`No se encontró el registro para votante ${votanteId} en la elección ${eleccionId}`);
      }

      const actualizado = this.actualizar(bd, { votanteId, eleccionId }, { transaccion });

      return actualizado;

    });

    return actualizarTransaccionStmt(eleccionId, votanteId, transaccion);
  }

  obtenerCompromisosEleccion(bd, eleccionId, compromisoIdx, max) {
    
    return bd.prepare(`
      
      SELECT compromiso, compromisoIdx
      FROM RegistroVotanteEleccion 
      WHERE eleccionId = @eleccionId
      AND compromisoIdx >= @compromisoIdx
      ORDER BY compromisoIdx LIMIT @max
    
    `).all({ eleccionId, compromisoIdx, max });
  }

}