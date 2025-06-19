import { poolBD } from './poolBD.js';

export function crearDAOProxy(tabla) {
  return new Proxy({}, {
    get(target, prop) {
      // Devuelve una función asíncrona que envía la acción al worker
      return async (...args) => {
        return await poolBD.runTask({
          action: prop, // nombre del método (básico o especial)
          tabla,
          args
        });
      };
    }
  });
}