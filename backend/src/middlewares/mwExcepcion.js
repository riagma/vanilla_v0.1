import { ErrorApi } from '../errores/ErrorApi.js';

// Middleware de manejo de errores para Express
export function mwExcepcion(error, peticion, respuesta, siguiente) {
  if (error instanceof ErrorApi) {
    return respuesta.status(error.codigo).json({
      error: error.message
    });
  }
  console.error('Error en API:', error);
  respuesta.status(500).json({
    error: 'Error interno del servidor'
  });
}