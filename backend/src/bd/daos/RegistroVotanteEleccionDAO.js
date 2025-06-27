import e from 'express';
import { BaseDAO } from './BaseDAO.js';
import { el } from '@faker-js/faker';

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

  obtenerSiguienteIdx(bd, eleccionId) {

    const registroPrevio = bd.prepare(`
      SELECT compromisoTxId, compromisoIdx
      FROM RegistroVotanteEleccion
      WHERE eleccionId = ?
      ORDER BY compromisoIdx DESC LIMIT 1
    `).get(eleccionId);

    if (registroPrevio) {
      return { siguienteIdx: registroPrevio.compromisoIdx + 1, txnIdprevio: registroPrevio.compromisoTxId };
    } else {
      return { siguienteIdx: 0, txnIdprevio: null };
    }

    // const siguienteIdx = bd.prepare(`
    //     SELECT COALESCE(MAX(compromisoIdx), -1) + 1 AS nuevo_idx, compromisoTxId AS txnIdprevio
    //     FROM RegistroVotanteEleccion
    //     WHERE eleccionId = ?
    //   `).get(eleccionId);
    //   return { siguienteIdx: siguienteIdx.nuevo_idx, txnIdprevio: siguienteIdx.txnIdprevio };
  }

  //----------------------------------------------------------------------------

  registrarVotanteEleccion(bd, { votanteId, eleccionId, compromiso, datosPrivados = null }) {

    const registrarVotante = bd.transaction((votanteId, eleccionId, compromiso) => {

      const { siguienteIdx, txnIdprevio } = this.obtenerSiguienteIdx(bd, eleccionId);

      const registro = {
        votanteId,
        eleccionId,
        compromiso,
        compromisoIdx: siguienteIdx,
        compromisoTxId: 'TEMPORAL',
        fechaRegistro: new Date().toISOString(),
        datosPrivados
      };

      console.log(registro);
      this.crear(bd, registro);

      registro.compromisoTxId = txnIdprevio;

      return registro;
    });

    return registrarVotante(votanteId, eleccionId, compromiso);
  }

  //----------------------------------------------------------------------------

  actualizarTransaccion(bd, { votanteId, eleccionId, compromisoTxId }) {

    const actualizarTransaccionStmt = bd.transaction((votanteId, eleccionId, compromisoTxId) => {

      const registro = this.obtenerPorId(bd, { votanteId, eleccionId });

      if (!registro) {
        throw new Error(`No se encontró el registro para votante ${votanteId} en la elección ${eleccionId}`);
      }

      const actualizado = this.actualizar(bd, { votanteId, eleccionId }, { compromisoTxId });

      return actualizado;
    });

    return actualizarTransaccionStmt(votanteId, eleccionId, compromisoTxId);
  }

  //----------------------------------------------------------------------------

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