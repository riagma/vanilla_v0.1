import { BaseDAO } from './BaseDAO.js';

export class VotanteDAO extends BaseDAO {
  constructor() {
    super('Votante');
  }

  obtenerPorDNI(bd, dni) {
    console.log('Obteniendo votante por DNI:', dni);
    return this.obtenerPorId(bd, { dni });
  }

  obtenerPorEmail(bd, email) {
    return bd.get('SELECT * FROM Votante WHERE email = ?', [email]);
  }

  async actualizarContrasena(bd, dni, hashContrasena) {
    return this.actualizar(
      bd,
      { dni },
      { hashContrasena }
    );
  }
}