import { servicioIndexedDB } from './servicioIndexedDB.js';
import { Usuario } from '../modelo/modelo.js';

// Función para hashear contraseñas (SHA-256)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const authLocalService = {
  // Registrar un nuevo usuario
  async registrar(nombre, password) {
    try {
      // Verificar si el usuario ya existe
      const usuarioExistente = await servicioIndexedDB.obtenerUsuario(nombre);
      if (usuarioExistente) {
        throw new Error('El usuario ya existe');
      }

      // Crear hash de la contraseña
      const passwordHash = await hashPassword(password);
      
      // Crear y guardar usuario
      const usuario = new Usuario({ nombre, passwordHash });
      await servicioIndexedDB.crearUsuario(usuario);
      
      return { success: true, usuario: { nombre } };
    } catch (error) {
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }
  },

  // Iniciar sesión
  async login(nombre, password) {
    try {
      // Buscar usuario
      const usuario = await servicioIndexedDB.obtenerUsuario(nombre);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña
      const passwordHash = await hashPassword(password);
      if (usuario.passwordHash !== passwordHash) {
        throw new Error('Contraseña incorrecta');
      }

      // Obtener elecciones del usuario
      const elecciones = await servicioIndexedDB.obtenerEleccionesPorUsuario(nombre);
      
      return { 
        success: true, 
        usuario: { nombre },
        elecciones
      };
    } catch (error) {
      throw new Error(`Error al iniciar sesión: ${error.message}`);
    }
  },

  // Cambiar contraseña
  async cambiarPassword(nombre, passwordActual, passwordNueva) {
    try {
      // Verificar contraseña actual
      const { success } = await this.login(nombre, passwordActual);
      if (!success) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Actualizar con nueva contraseña
      const passwordHash = await hashPassword(passwordNueva);
      const usuario = new Usuario({ nombre, passwordHash });
      await servicioIndexedDB.actualizarUsuario(usuario);
      
      return { success: true };
    } catch (error) {
      throw new Error(`Error al cambiar contraseña: ${error.message}`);
    }
  }
};