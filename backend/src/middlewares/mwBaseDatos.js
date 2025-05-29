import { obtenerDB } from '../bd/bd.js';

export async function mwBaseDatos(peticion, respuesta, siguiente) {
  try {
    peticion.bd = await obtenerDB();
    await siguiente();
  } finally {
    if (peticion.bd) {
      await peticion.bd.close();
    }
  }
}