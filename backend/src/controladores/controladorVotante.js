import { servicioElecciones } from '../servicios/servicioElecciones.js';

export const controladorVotante = {

  //----------------------------------------------------------------------------

  async obtenerDatosVotante(peticion, respuesta) {
    try {
      respuesta.json({
        votante: peticion.votante
      });
    } catch (error) {
      respuesta.status(500).json({ error: error.message });
    }
  },

  //----------------------------------------------------------------------------

  async listarEleccionesDisponibles(peticion, respuesta) {
    try {
      console.log('Listando elecciones para el votante:', peticion.votante.dni);
      const elecciones = await servicioElecciones.obtenerTodas(peticion.bd);
      respuesta.json(elecciones || []);
    } catch (error) {
      respuesta.status(500).json({ error: error.message });
    }
  },

  //----------------------------------------------------------------------------

  async obtenerEleccionPorId(peticion, respuesta) {
    try {
      const eleccion = await servicioElecciones.obtenerPorId(
        peticion.bd,
        peticion.params.idEleccion
      );
      if (!eleccion) {
        return respuesta.status(404).json({ error: 'Elección no encontrada' });
      }
      respuesta.json(eleccion);
    } catch (error) {
      respuesta.status(500).json({ error: error.message });
    }
  },

 //----------------------------------------------------------------------------

  async obtenerDetalleEleccion(peticion, respuesta) {
    try {
      const detalleEleccion = await servicioElecciones.obtenerDetalle(
        peticion.bd,
        peticion.params.idEleccion,
        peticion.votante.dni
      );
      if (!detalleEleccion) {
        return respuesta.status(404).json({ error: 'Elección no encontrada' });
      }
      console.log('Detalle de elección:', detalleEleccion);
      respuesta.json(detalleEleccion);
    } catch (error) {
      respuesta.status(500).json({ error: error.message });
    }
  },

  //----------------------------------------------------------------------------

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