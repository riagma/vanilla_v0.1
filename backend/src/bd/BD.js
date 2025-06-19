import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { RUTA_BD } from '../utiles/constantes.js';

export class ConexionBD {
  constructor(ruta = RUTA_BD) {
    this.ruta = ruta;
    this.db = null;
  }

  abrir() {
    if (!this.db) {
      console.log(`Abriendo conexión con base de datos: ${this.ruta}`);
      this.db = new Database(this.ruta, { fileMustExist: true });
    }
    return this.db;
  }

  cerrar() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

function _asegurarDirectorioBD() {
  const directorio = path.dirname(RUTA_BD);
  mkdirSync(directorio, { recursive: true });
}

let instancia = null;
export function abrirConexionBD() {
  if (!instancia) {
    _asegurarDirectorioBD();
    instancia = new ConexionBD();
    instancia.abrir();
  }
  return instancia.db;
}

export function cerrarConexionBD() {
  if (!instancia) {
    instancia.cerrar();
    instancia = null;
  }
}