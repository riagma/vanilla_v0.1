import { contexto } from '../modelo/contexto.js';
import { voto3IDB } from '../modelo/voto3IDB.js';
import {
  generarSalt,
  derivarClave,
  hashPassword
} from '../utiles/utilesCrypto.js';

import { servicioVotante } from './servicioVotante.js';

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
  async registrarVotante(nombreUsuario, contrasena, repetirContrasena) {
    if (!nombreUsuario || !contrasena || !repetirContrasena) {
      throw new Error('Todos los campos son obligatorios.');
    }
    if (contrasena !== repetirContrasena) {
      throw new Error('Las contraseñas no coinciden.');
    }
    // Comprobar que no existe ya
    const existente = await voto3IDB.obtenerVotante(nombreUsuario);
    if (existente) {
      throw new Error('Ya existe un usuario con ese nombreUsuario.');
    }
    // Generar salt único para este usuario
    const claveSalt = generarSalt();
    const claveDerivada = await derivarClave(contrasena, claveSalt);

    // Derivar clave y hash
    const contrasenaHash = await hashPassword(contrasena);
    const votante = { nombreUsuario, contrasenaHash, claveSalt };
    console.log('Registrando votante:', votante);
    await voto3IDB.crearVotante(votante);

    // Guardar clave derivada en memoria para la sesión
    claveDerivadaSesion = claveDerivada;

    contexto.limpiarContexto();
    contexto.actualizarContexto({ nombreUsuario });
  },

  // Login de votante existente
  async loginVotante(nombreUsuario, contrasena) {
    if (!nombreUsuario || !contrasena) {
      throw new Error('Nombre y contraseña obligatorios.');
    }
    // console.log('Intentando login con:', nombreUsuario);
    const votante = await voto3IDB.obtenerVotante(nombreUsuario);
    if (!votante) {
      throw new Error('Usuario no encontrado.');
    }
    // console.log('Votante encontrado:', votante);
    const contrasenaHash = await hashPassword(contrasena);
    if (votante.contrasenaHash !== contrasenaHash) {
      throw new Error('Contraseña incorrecta.');
    }
    // Derivar clave con el salt guardado
    const claveDerivada = await derivarClave(contrasena, votante.claveSalt);
    claveDerivadaSesion = claveDerivada;
    contexto.limpiarContexto();
    contexto.actualizarContexto({ nombreUsuario });
    console.log('Login exitoso para:', nombreUsuario);

    const datosCensales = await servicioVotante.recuperarDatosCensales();
    console.log('Datos censales recuperados:', datosCensales);
  }
};