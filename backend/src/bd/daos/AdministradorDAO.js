import { BaseDAO } from './BaseDAO.js';

export class AdministradorDAO extends BaseDAO {
  constructor() {
    super('Administrador');
  }

  async obtenerPorCorreo(db, correo) {
    return await this.obtenerPorId(db, correo, 'correo');
  }

  async verificarCredenciales(db, correo, hashContrasena) {
    return await db.get(
      'SELECT * FROM Administrador WHERE correo = ? AND hashContrasena = ?',
      [correo, hashContrasena]
    );
  }
}