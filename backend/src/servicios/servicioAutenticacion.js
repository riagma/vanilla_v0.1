import jwt from 'jsonwebtoken';
import { SECRETO } from '../utiles/constantes.js';
import { daos } from '../bd/daos.js';
import bcrypt from 'bcrypt';

export const servicioAutenticacion = {
  async loginVotante(bd, dni, clave) {
    const votante = await daos.votante.obtenerPorDNI(bd, dni);
    if (!votante) {
      throw new Error('Credenciales inválidas');
    }

    const claveCorrecta = await bcrypt.compare(clave, votante.hashContrasena);
    if (!claveCorrecta) {
      throw new Error('Credenciales inválidas');
    }

    return jwt.sign({ 
      dni: votante.dni,
      tipo: 'votante' 
    }, SECRETO, { expiresIn: '1h' });
  },

  async loginAdmin(bd, correo, clave) {
    const admin = await daos.administrador.obtenerPorCorreo(bd, correo);
    if (!admin) {
      throw new Error('Credenciales inválidas');
    }

    const claveCorrecta = await bcrypt.compare(clave, admin.hashContrasena);
    if (!claveCorrecta) {
      throw new Error('Credenciales inválidas');
    }

    return jwt.sign({ 
      correo: admin.correo,
      tipo: 'admin' 
    }, SECRETO, { expiresIn: '1h' });
  }
};