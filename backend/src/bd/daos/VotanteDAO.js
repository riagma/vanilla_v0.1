import { BaseDAO } from './BaseDAO.js';

export class VotanteDAO extends BaseDAO {
  constructor() {
    super('Votante');
  }

  async obtenerPorDNI(db, dni) {
    return await this.obtenerPorId(db, dni, 'dni');
  }

  async obtenerPorCorreo(db, correo) {
    return await db.get(
      'SELECT * FROM Votante WHERE correoElectronico = ?',
      [correo]
    );
  }

  async actualizarContrasena(db, dni, hashContrasena) {
    return await this.actualizar(
      db, 
      dni, 
      { hashContrasena }, 
      'dni'
    );
  }
}