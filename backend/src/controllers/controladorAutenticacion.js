import { servicioAutenticacion } from '../services/servicioAutenticacion.js';

export const controladorAutenticacion = {
  async loginVotante(peticion, respuesta) {
    const { dni, clave } = peticion.body;
    try {
      const token = await servicioAutenticacion.loginVotante(dni, clave);
      respuesta.json({ token });
    } catch (error) {
      respuesta.status(401).json({ error: error.message });
    }
  },

  async loginAdmin(peticion, respuesta) {
    const { correo, clave } = peticion.body;
    try {
      const token = await servicioAutenticacion.loginAdmin(correo, clave);
      respuesta.json({ token });
    } catch (error) {
      respuesta.status(401).json({ error: error.message });
    }
  },

  async perfilVotante(peticion, respuesta) {
    try {
      // Los datos del votante ya están en la petición gracias al middleware
      respuesta.json({ 
        votante: peticion.votante
      });
    } catch (error) {
      respuesta.status(403).json({ error: error.message });
    }
  },

  async perfilAdmin(peticion, respuesta) {
    try {
      // Los datos del admin ya están en la petición gracias al middleware
      respuesta.json({ 
        administrador: peticion.administrador
      });
    } catch (error) {
      respuesta.status(403).json({ error: error.message });
    }
  }
};