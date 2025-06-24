import { BaseDAO } from './BaseDAO.js';
import { contratoRecicladoDAO } from '../DAOs.js';

export class ContratoBlockchainDAO extends BaseDAO {
  constructor() {
    super('ContratoBlockchain');
  }

  reciclarContrato(bd, contratoId) {
    const reciclarContrato = bd.transaction((contratoId) => {
      const contrato = this.obtenerPorId(bd, { contratoId });
      contratoRecicladoDAO.crear(bd, contrato);
      this.eliminar(bd, { contratoId });
    });
    return reciclarContrato(contratoId);
  }
}