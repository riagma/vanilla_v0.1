import { api } from './api.js';
import { 
  validarDatos,
  esquemaEleccion,
  esquemaElecciones, 
  esquemaDetalleEleccion 
} from '../modelo/esquemas.js';

export const servicioEleccion = {
  async cargarElecciones() {
    try {
      const elecciones = await api.get('/api/eleccion/disponibles');
      return validarDatos(elecciones, esquemaElecciones);
    } catch (error) {
      throw new Error('Error al cargar elecciones: ' + error.message);
    }
  },

  async cargarEleccion(idEleccion) {
    try {
      const eleccion = await api.get(`/api/eleccion/${idEleccion}`);
      return validarDatos(eleccion, esquemaEleccion);
    } catch (error) {
      throw new Error('Error al cargar el detalle de la elección: ' + error.message);
    }
  },
  
  async cargarPartidos(idEleccion) {
    try {
      const partidos = await api.get(`/api/eleccion/${idEleccion}/partidos`);
      // return validarDatos(partidos, esquemaDetalleEleccion);
      return partidos; // No hay esquema específico para partidos
    } catch (error) {
      throw new Error('Error al cargar los partidos de la elección: ' + error.message);
    }
  },
  
  async cargarContrato(idEleccion) {
    try {
      const contrato = await api.get(`/api/eleccion/${idEleccion}/contrato`);
      // return validarDatos(partidos, esquemaDetalleEleccion);
      // console.log('Contrato cargado:', contrato);
      return contrato; // No hay esquema específico para partidos
    } catch (error) {
      throw new Error('Error al cargar el contrato de la elección: ' + error.message);
    }
  },
    
  async cargarResultados(idEleccion) {
    try {
      const contrato = await api.get(`/api/eleccion/${idEleccion}/resultados`);
      // return validarDatos(partidos, esquemaDetalleEleccion);
      return contrato; // No hay esquema específico para partidos
    } catch (error) {
      throw new Error('Error al cargar el contrato de la elección: ' + error.message);
    }
  },
};