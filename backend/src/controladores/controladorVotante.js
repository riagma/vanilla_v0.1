import { servicioElecciones } from '../servicios/servicioElecciones.js';

export const controladorVotante = {
  async obtenerDatos(peticion, respuesta) {
    try {
      respuesta.json({ 
        votante: peticion.votante 
      });
    } catch (error) {
      respuesta.status(500).json({ error: error.message });
    }
  },

  async listarEleccionesDisponibles(peticion, respuesta) {
    try {
      console.log('Listando elecciones para el votante:', peticion.votante.dni);
      const elecciones = await servicioElecciones.listarTodas(peticion.bd);
      respuesta.json(elecciones || []);
    } catch (error) {
      respuesta.status(500).json({ error: error.message });
    }
  },

  async registrarseEnEleccion(peticion, respuesta) {
    try {
      await servicioElecciones.registrarVotante(
        peticion.bd,
        peticion.votante.dni,
        peticion.params.id,
        peticion.body.compromiso
      );
      respuesta.sendStatus(204);
    } catch (error) {
      respuesta.status(400).json({ error: error.message });
    }
  },
};