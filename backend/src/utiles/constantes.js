import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ALGO_ENV = process.env.ALGO_ENV || 'localnet';
export const NODE_ENV = process.env.NODE_ENV || 'development';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const algoEnvPath = path.join(__dirname, `../../.env.${ALGO_ENV}`);
console.log(`Cargando configuración desde: ${algoEnvPath}`);
config({ path: algoEnvPath });

const nodeEnvPath = path.join(__dirname, `../../.env.${NODE_ENV}`);
console.log(`Cargando configuración desde: ${nodeEnvPath}`);
config({ path: nodeEnvPath });

// Configuración de algorand
export const ALGOD_TOKEN = process.env.ALGOD_TOKEN;
export const ALGOD_SERVER = process.env.ALGOD_SERVER;
export const ALGOD_PORT = process.env.ALGOD_PORT;

export const INDEXER_TOKEN = process.env.INDEXER_TOKEN;
export const INDEXER_SERVER = process.env.INDEXER_SERVER;
export const INDEXER_PORT = process.env.INDEXER_PORT;

export const ARTIFACTS_DIR = '../../' + process.env.ARTIFACTS_DIR ?? '../algorand/smart_contracts/artifacts/voto3/';

export const PUBLIC_DIR = process.env.PUBLIC_DIR ?? './public/';
export const CIRCUIT_DIR = process.env.CIRCUIT_DIR ?? './public/circuits/';


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

//--------------

export const CONFIG = {
  ALGO_ENV,
  NODE_ENV,
  RUTA_BD,
  PUERTO,
  SECRETO,
  ALGOD_TOKEN,
  ALGOD_SERVER,
  ALGOD_PORT,
  INDEXER_TOKEN,
  INDEXER_SERVER,
  INDEXER_PORT,
  ARTIFACTS_DIR,
  EXPIRACION_TOKEN_ADMIN,
  EXPIRACION_TOKEN_VOTANTE,
  ESTADOS_ELECCION,
  ERRORES,
  API_BASE,
  API_AUTH,
  API_ADMIN,
  API_VOTANTE
};

