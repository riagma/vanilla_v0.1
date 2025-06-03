import { servicioVotante } from '../servicios/votanteService.js';
import { vistaVotante } from '../vistas/votante/vistaVotante.js';

export const controladorVotante = {
  async listaElecciones(contenedor) {
    const elecciones = await servicioVotante.cargarElecciones();
    return vistaVotante(contenedor, elecciones);
  },
  
  async detalleEleccion(contenedor, id) {
    const detalle = await servicioVotante.cargarDetalleEleccion(id);
    return vistaDetalleEleccion(contenedor, detalle);
  }
};