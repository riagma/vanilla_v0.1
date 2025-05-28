import jwt from 'jsonwebtoken';
import { SECRETO } from '../utils/constantes.js';
import { daos } from '../bd/daos.js';
import bcrypt from 'bcrypt';

export const servicioAutenticacion = {
  async loginVotante(db, dni, clave) {
    const votante = await daos.votante.obtenerPorDNI(db, dni);
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

  async loginAdmin(db, correo, clave) {
    const admin = await daos.administrador.obtenerPorCorreo(db, correo);
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