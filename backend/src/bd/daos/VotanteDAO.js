import { BaseDAO } from './BaseDAO.js';

export class VotanteDAO extends BaseDAO {
  constructor() {
    super('Votante');
  }

  async obtenerPorDNI(bd, dni) {
    console.log('Obteniendo votante por DNI:', dni);
    return await this.obtenerPorId(bd, { dni });
  }

  async obtenerPorCorreo(bd, correo) {
    return await bd.get(
      'SELECT * FROM Votante WHERE correoElectronico = ?',
      [correo]
    );
  }

  async actualizarContrasena(bd, dni, hashContrasena) {
    return await this.actualizar(
      bd,
      { dni },
      { hashContrasena }
    );
  }
}