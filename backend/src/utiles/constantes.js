import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas y configuración de BD
export const RUTA_BD = process.env.NODE_ENV === 'production'
  ? '/var/lib/vanilla-voting/vanilla.db'
  : path.join(__dirname, '../bd/datos/dev.db');

// Configuración del servidor
export const PUERTO = process.env.PORT || 3000;
export const SECRETO = process.env.JWT_SECRET || 'clave-secreta-desarrollo';

// Tiempos de expiración de tokens
export const EXPIRACION_TOKEN_ADMIN = '8h';
export const EXPIRACION_TOKEN_VOTANTE = '2h';

// Estados de elección
export const ESTADOS_ELECCION = {
  PENDIENTE: 'PENDIENTE',
  REGISTRO: 'REGISTRO',
  VOTACION: 'VOTACION',
  CERRADA: 'CERRADA'
};

// Mensajes de error comunes
export const ERRORES = {
  NO_AUTORIZADO: 'No autorizado',
  TOKEN_INVALIDO: 'Token inválido',
  CREDENCIALES_INVALIDAS: 'Credenciales inválidas',
  RECURSO_NO_ENCONTRADO: 'Recurso no encontrado',
  OPERACION_NO_PERMITIDA: 'Operación no permitida'
};

// URLs base para API
export const API_BASE = '/api';
export const API_AUTH = `${API_BASE}/login`;
export const API_ADMIN = `${API_BASE}/admin`;
export const API_VOTANTE = `${API_BASE}/votante`;