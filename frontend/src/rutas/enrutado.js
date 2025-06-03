import { extraerParametrosRuta } from '../utiles/utiles.js';
import { vistaLogin } from '../vistas/vistaLogin.js';
import { vistaVotante } from '../vistas/vistaVotante.js';
import { vistaAdmin } from '../vistas/vistaAdmin.js';
import { vistaDetalleEleccion } from '../vistas/vistaDetalleEleccion.js';

export const RUTAS = {
  VOTANTE: {
    '/elecciones': (contenedor) => vistaVotante(contenedor),
    '/elecciones/:id': (contenedor, params) => vistaDetalleEleccion(contenedor, parseInt(params.id))
  },
  ADMIN: {
    '/elecciones': (contenedor) => vistaAdmin(contenedor),
    '/elecciones/:id': null,
  }
};

export function obtenerVista(tipoUsuario, ruta) {
  const rutasDisponibles = RUTAS[tipoUsuario];
  if (!rutasDisponibles) {
    throw new Error(`Tipo de usuario no válido: ${tipoUsuario}`);
  }

  // Redirigir a '/elecciones' si el usuario tiene token y está intentando acceder a '/'
  if (ruta === '/') {
    console.log(`Redirigiendo a '/elecciones' para el tipo de usuario: ${tipoUsuario}`);
    navegarA('/elecciones');
    return rutasDisponibles['/elecciones'];
  }

  // Usar extraerParametrosRuta de utiles.js
  const [rutaBase, params] = extraerParametrosRuta(ruta, Object.keys(rutasDisponibles));
  const vista = rutasDisponibles[rutaBase];

  if (!vista) {
    throw new Error(`Ruta "${ruta}" no encontrada para ${tipoUsuario}`);
  }

  // Devolver una función que recibe el contenedor y aplica los parámetros
  return (contenedor) => vista(contenedor, params);
}

export function vistaInicial(contenedor) {
  return vistaLogin(contenedor);
}

export function navegarA(ruta) {
  location.hash = '#' + ruta;
}