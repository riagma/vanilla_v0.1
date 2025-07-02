import { servicioIndexedDB } from './servicioIndexedDB.js';
import { authLocalService } from './authLocalService.js';
import { EleccionUsuario } from '../modelo/modelo.js';

// Estado global de autenticación
let appState = {
  isAuthenticated: false,
  user: null,
  eleccionesLocales: [],
  loading: true,
  error: null
};

// Array de funciones callback para cuando cambia el estado
let stateListeners = [];

// Función para notificar cambios de estado
function notifyStateChange() {
  stateListeners.forEach(listener => listener(appState));
}

// Función para actualizar el estado
function updateState(newState) {
  appState = { ...appState, ...newState };
  notifyStateChange();
}

export const authManager = {
  // Obtener el estado actual
  getState() {
    return { ...appState };
  },

  // Suscribirse a cambios de estado
  subscribe(listener) {
    stateListeners.push(listener);
    // Devolver función para desuscribirse
    return () => {
      stateListeners = stateListeners.filter(l => l !== listener);
    };
  },

  // Inicializar IndexedDB
  async inicializar() {
    try {
      updateState({ loading: true, error: null });
      await servicioIndexedDB.inicializar();
      updateState({ loading: false });
      return { success: true };
    } catch (error) {
      console.error('Error al inicializar IndexedDB:', error);
      updateState({ 
        loading: false, 
        error: 'Error al inicializar la base de datos local' 
      });
      return { success: false, error: error.message };
    }
  },

  // Login local
  async loginLocal(nombre, password) {
    try {
      updateState({ loading: true, error: null });
      const resultado = await authLocalService.login(nombre, password);
      
      updateState({
        isAuthenticated: true,
        user: resultado.usuario,
        eleccionesLocales: resultado.elecciones,
        loading: false
      });
      
      return { success: true };
    } catch (error) {
      updateState({ 
        loading: false, 
        error: error.message,
        isAuthenticated: false,
        user: null,
        eleccionesLocales: []
      });
      return { success: false, error: error.message };
    }
  },

  // Registro local
  async registrarLocal(nombre, password) {
    try {
      updateState({ loading: true, error: null });
      const resultado = await authLocalService.registrar(nombre, password);
      
      updateState({
        isAuthenticated: true,
        user: resultado.usuario,
        eleccionesLocales: [],
        loading: false
      });
      
      return { success: true };
    } catch (error) {
      updateState({ 
        loading: false, 
        error: error.message,
        isAuthenticated: false,
        user: null,
        eleccionesLocales: []
      });
      return { success: false, error: error.message };
    }
  },

  // Logout
  logout() {
    updateState({
      isAuthenticated: false,
      user: null,
      eleccionesLocales: [],
      loading: false,
      error: null
    });
  },

  // Agregar elección local
  async agregarEleccionLocal(eleccionId, datosAdicionales = {}) {
    try {
      if (!appState.user) throw new Error('Usuario no autenticado');

      const eleccion = new EleccionUsuario({ 
        nombre: appState.user.nombre, 
        eleccionId,
        ...datosAdicionales
      });
      
      await servicioIndexedDB.crearEleccion(eleccion);
      
      // Actualizar elecciones en el estado
      const eleccionesActualizadas = await servicioIndexedDB.obtenerEleccionesPorUsuario(appState.user.nombre);
      updateState({ eleccionesLocales: eleccionesActualizadas });
      
      return { success: true };
    } catch (error) {
      console.error('Error al agregar elección:', error);
      return { success: false, error: error.message };
    }
  },

  // Actualizar elección local
  async actualizarEleccionLocal(eleccionId, datosActualizados) {
    try {
      if (!appState.user) throw new Error('Usuario no autenticado');

      const eleccionExistente = await servicioIndexedDB.obtenerEleccion(appState.user.nombre, eleccionId);
      if (!eleccionExistente) throw new Error('Elección no encontrada');

      const eleccionActualizada = { ...eleccionExistente, ...datosActualizados };
      await servicioIndexedDB.actualizarEleccion(eleccionActualizada);
      
      // Actualizar elecciones en el estado
      const eleccionesActualizadas = await servicioIndexedDB.obtenerEleccionesPorUsuario(appState.user.nombre);
      updateState({ eleccionesLocales: eleccionesActualizadas });
      
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar elección:', error);
      return { success: false, error: error.message };
    }
  },

  // Eliminar elección local
  async eliminarEleccionLocal(eleccionId) {
    try {
      if (!appState.user) throw new Error('Usuario no autenticado');

      await servicioIndexedDB.eliminarEleccion(appState.user.nombre, eleccionId);
      
      // Actualizar elecciones en el estado
      const eleccionesActualizadas = await servicioIndexedDB.obtenerEleccionesPorUsuario(appState.user.nombre);
      updateState({ eleccionesLocales: eleccionesActualizadas });
      
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar elección:', error);
      return { success: false, error: error.message };
    }
  },

  // Limpiar error
  clearError() {
    updateState({ error: null });
  },

  // Utilidades para trabajar con elecciones locales
  obtenerEleccion(eleccionId) {
    return appState.eleccionesLocales.find(e => e.eleccionId === eleccionId);
  },

  tieneEleccion(eleccionId) {
    return appState.eleccionesLocales.some(e => e.eleccionId === eleccionId);
  }
};