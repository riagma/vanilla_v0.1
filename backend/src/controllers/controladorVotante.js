import { servicioElecciones } from '../services/servicioElecciones.js';
import { servicioVotos } from '../services/servicioVotos.js';

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
      const elecciones = await servicioElecciones.listarPorVotante(
        peticion.db,
        peticion.votante.dni
      );
      respuesta.json({ elecciones });
    } catch (error) {
      respuesta.status(500).json({ error: error.message });
    }
  },

  async registrarseEnEleccion(peticion, respuesta) {
    try {
      await servicioElecciones.registrarVotante(
        peticion.db,
        peticion.votante.dni,
        peticion.params.id,
        peticion.body.compromiso
      );
      respuesta.sendStatus(204);
    } catch (error) {
      respuesta.status(400).json({ error: error.message });
    }
  },

  async emitirVoto(peticion, respuesta) {
    try {
      await servicioVotos.emitir(
        peticion.db,
        peticion.votante.dni,
        peticion.params.id,
        peticion.body.voto,
        peticion.body.prueba
      );
      respuesta.sendStatus(204);
    } catch (error) {
      respuesta.status(400).json({ error: error.message });
    }
  }
};