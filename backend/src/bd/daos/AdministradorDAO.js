import { BaseDAO } from './BaseDAO.js';

export class AdministradorDAO extends BaseDAO {
  constructor() {
    super('Administrador');
  }

  async obtenerPorCorreo(bd, correo) {
    return await this.obtenerPorId(bd, correo, 'correo');
  }

  async verificarCredenciales(bd, correo, hashContrasena) {
    return await bd.get(
      'SELECT * FROM Administrador WHERE correo = ? AND hashContrasena = ?',
      [correo, hashContrasena]
    );
  }
}