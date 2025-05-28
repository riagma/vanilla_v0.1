import fs from 'fs/promises';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { RUTA_BD } from '../utils/constantes.js';

async function asegurarDirectorioBD() {
  const directorio = path.dirname(RUTA_BD);
  await fs.mkdir(directorio, { recursive: true });
}

export async function obtenerDB() {
  await asegurarDirectorioBD();
  return await open({
    filename: RUTA_BD,
    driver: sqlite3.Database
  });
}