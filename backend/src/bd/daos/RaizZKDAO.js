import { BaseDAO } from './BaseDAO.js';

export class RaizZKDAO extends BaseDAO {
  constructor() {
    super('RaizZK');
  }

  eliminarPruebaZK(bd, pruebaId) {
    return bd.prepare(`DELETE FROM RaizZK WHERE pruebaId = ?`).run(pruebaId).changes;
  }
}