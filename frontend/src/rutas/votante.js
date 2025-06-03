import { votanteController } from '../controladores/controladorVotante.js';

export const votanteRoutes = {
  '/elecciones': votanteController.listaElecciones,
  '/eleccion/:id': votanteController.detalleEleccion
};