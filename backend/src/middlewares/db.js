import { obtenerDB } from '../db/bd.js';

export async function dbMiddleware(peticion, respuesta, siguiente) {
  try {
    peticion.db = await obtenerDB();
    await siguiente();
  } finally {
    if (peticion.db) {
      await peticion.db.close();
    }
  }
}