import { contexto } from '../contexto.js';
import { servicioIndexedDB } from './servicioIndexedDB.js';
import {
  generarSalt,
  derivarClave,
  hashPassword
} from '../utiles/utilesCrypto.js';

// Variable de módulo: clave derivada en memoria (solo durante la sesión)
let claveDerivadaSesion = null;

export const servicioLogin = {
  getClaveDerivada() {
    return claveDerivadaSesion;
  },

  logout() {
    claveDerivadaSesion = null;
    contexto.limpiarContexto();
  },

  // Registro de nuevo votante
  async registrarVotante(nombre, contrasena, repetirContrasena, dni) {
    if (!nombre || !contrasena || !repetirContrasena || !dni) {
      throw new Error('Todos los campos son obligatorios.');
    }
    if (contrasena !== repetirContrasena) {
      throw new Error('Las contraseñas no coinciden.');
    }
    // Comprobar que no existe ya
    const existente = await servicioIndexedDB.obtenerVotante(nombre);
    if (existente) {
      throw new Error('Ya existe un usuario con ese nombre.');
    }
    // Generar salt único para este usuario
    const salt = generarSalt();
    // Derivar clave y hash
    const claveDerivada = await derivarClave(contrasena, salt);
    const passwordHash = await hashPassword(contrasena);
    const votante = { nombre, passwordHash, dni, salt };
    await servicioIndexedDB.crearVotante(votante);

    // Guardar clave derivada en memoria para la sesión
    claveDerivadaSesion = claveDerivada;

    // Guardar en contexto global (sin contraseña ni hash)
    contexto.actualizarContexto({
      token: null,
      tipoUsuario: 'VOTANTE',
      usuario: { nombre, dni },
      datosAdmin: null,
      datosVotante: { nombre, dni }
    });
  },

  // Login de votante existente
  async loginVotante(nombre, contrasena) {
    if (!nombre || !contrasena) {
      throw new Error('Nombre y contraseña obligatorios.');
    }
    const votante = await servicioIndexedDB.obtenerVotante(nombre);
    if (!votante) {
      throw new Error('Usuario no encontrado.');
    }
    const passwordHash = await hashPassword(contrasena);
    if (votante.passwordHash !== passwordHash) {
      throw new Error('Contraseña incorrecta.');
    }
    // Derivar clave con el salt guardado
    const claveDerivada = await derivarClave(contrasena, votante.salt);
    claveDerivadaSesion = claveDerivada;

    // Guardar en contexto global (sin contraseña ni hash)
    contexto.actualizarContexto({
      token: null,
      tipoUsuario: 'VOTANTE',
      usuario: { nombre: votante.nombre, dni: votante.dni },
      datosAdmin: null,
      datosVotante: { nombre: votante.nombre, dni: votante.dni }
    });
  }
};