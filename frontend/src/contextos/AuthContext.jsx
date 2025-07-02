import { createContext, useContext, useReducer, useEffect } from 'react';
import { indexedDBService } from '../servicios/indexedDBService.js';
import { authLocalService } from '../servicios/authLocalService.js';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        eleccionesLocales: action.payload.elecciones || [],
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        eleccionesLocales: [],
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'UPDATE_ELECCIONES':
      return {
        ...state,
        eleccionesLocales: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  eleccionesLocales: [],
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Inicializar IndexedDB al montar el componente
  useEffect(() => {
    const inicializar = async () => {
      try {
        await indexedDBService.inicializar();
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        console.error('Error al inicializar IndexedDB:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Error al inicializar la base de datos local' });
      }
    };

    inicializar();
  }, []);

  // Funciones de autenticación
  const loginLocal = async (nombre, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const resultado = await authLocalService.login(nombre, password);
      
      dispatch({ 
        type: 'LOGIN', 
        payload: { 
          user: resultado.usuario, 
          elecciones: resultado.elecciones 
        } 
      });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const registrarLocal = async (nombre, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const resultado = await authLocalService.registrar(nombre, password);
      
      dispatch({ 
        type: 'LOGIN', 
        payload: { 
          user: resultado.usuario, 
          elecciones: [] 
        } 
      });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Gestión de elecciones locales
  const agregarEleccionLocal = async (eleccionId, datosAdicionales = {}) => {
    try {
      if (!state.user) throw new Error('Usuario no autenticado');

      const eleccion = new EleccionUsuario({ 
        nombre: state.user.nombre, 
        eleccionId,
        ...datosAdicionales
      });
      
      await indexedDBService.crearEleccion(eleccion);
      
      // Actualizar elecciones en el estado
      const eleccionesActualizadas = await indexedDBService.obtenerEleccionesPorUsuario(state.user.nombre);
      dispatch({ type: 'UPDATE_ELECCIONES', payload: eleccionesActualizadas });
      
      return { success: true };
    } catch (error) {
      console.error('Error al agregar elección:', error);
      return { success: false, error: error.message };
    }
  };

  const actualizarEleccionLocal = async (eleccionId, datosActualizados) => {
    try {
      if (!state.user) throw new Error('Usuario no autenticado');

      const eleccionExistente = await indexedDBService.obtenerEleccion(state.user.nombre, eleccionId);
      if (!eleccionExistente) throw new Error('Elección no encontrada');

      const eleccionActualizada = { ...eleccionExistente, ...datosActualizados };
      await indexedDBService.actualizarEleccion(eleccionActualizada);
      
      // Actualizar elecciones en el estado
      const eleccionesActualizadas = await indexedDBService.obtenerEleccionesPorUsuario(state.user.nombre);
      dispatch({ type: 'UPDATE_ELECCIONES', payload: eleccionesActualizadas });
      
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar elección:', error);
      return { success: false, error: error.message };
    }
  };

  const eliminarEleccionLocal = async (eleccionId) => {
    try {
      if (!state.user) throw new Error('Usuario no autenticado');

      await indexedDBService.eliminarEleccion(state.user.nombre, eleccionId);
      
      // Actualizar elecciones en el estado
      const eleccionesActualizadas = await indexedDBService.obtenerEleccionesPorUsuario(state.user.nombre);
      dispatch({ type: 'UPDATE_ELECCIONES', payload: eleccionesActualizadas });
      
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar elección:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    ...state,
    loginLocal,
    registrarLocal,
    logout,
    agregarEleccionLocal,
    actualizarEleccionLocal,
    eliminarEleccionLocal,
    clearError: () => dispatch({ type: 'SET_ERROR', payload: null })
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};