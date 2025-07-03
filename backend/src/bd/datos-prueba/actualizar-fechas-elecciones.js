#!/usr/bin/env node
import { abrirConexionBD, cerrarConexionBD } from '../BD.js';
import { eleccionDAO } from '../DAOs.js';
import { preguntarUsuario } from '../../utiles/utilesScripts.js';
import { formatearFechaHora } from '../../utiles/utilesFechas.js';

//--------------

const ahora = new Date();
const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0);

//----------------------------------------------------------------------------

try {

  const bd = abrirConexionBD();

  let modificarElecciones = await preguntarUsuario(
    'Si van a modificar las fechas de la elecciones, ¿está seguro? (s/n): '
  );

  if (modificarElecciones) {

    eleccionDAO.actualizar(bd, { id: 1 }, {
      fechaInicioRegistro: formatearFechaHora(hoy, { incDD: -62 }),
      fechaFinRegistro: formatearFechaHora(hoy, { incDD: -42 }),
      fechaInicioVotacion: formatearFechaHora(hoy, { incDD: -41 }),
      fechaFinVotacion: formatearFechaHora(hoy, { incDD: -31 }),
      fechaEscrutinio: formatearFechaHora(hoy, { incDD: -30 }),
    });

    eleccionDAO.actualizar(bd, { id: 2 }, {
      fechaInicioRegistro: formatearFechaHora(hoy, { incDD: -22 }),
      fechaFinRegistro: formatearFechaHora(hoy, { incDD: -2 }),
      fechaInicioVotacion: formatearFechaHora(hoy, { incDD: -1 }),
      fechaFinVotacion: formatearFechaHora(hoy, { incDD: 9 }),
      fechaEscrutinio: formatearFechaHora(hoy, { incDD: -10 }),
    });

    eleccionDAO.actualizar(bd, { id: 3 }, {
      fechaInicioRegistro: formatearFechaHora(hoy, { incDD: -1 }),
      fechaFinRegistro: formatearFechaHora(hoy, { incDD: 21 }),
      fechaInicioVotacion: formatearFechaHora(hoy, { incDD: 22 }),
      fechaFinVotacion: formatearFechaHora(hoy, { incDD: 32 }),
      fechaEscrutinio: formatearFechaHora(hoy, { incDD: 33 }),
    });

    eleccionDAO.actualizar(bd, { id: 4 }, {
      fechaInicioRegistro: formatearFechaHora(hoy, { incDD: 30 }),
      fechaFinRegistro: formatearFechaHora(hoy, { incDD: 50 }),
      fechaInicioVotacion: formatearFechaHora(hoy, { incDD: 51 }),
      fechaFinVotacion: formatearFechaHora(hoy, { incDD: 61 }),
      fechaEscrutinio: formatearFechaHora(hoy, { incDD: 62 }),
    });

    console.log('Fechas de elecciones actualizadas correctamente.');

    for (let id = 1; id <= 4; id++) {
      const fechasEleccion = eleccionDAO.obtenerPorId(bd, { id }, [
        'nombre',
        'fechaInicioRegistro',
        'fechaFinRegistro',
        'fechaInicioVotacion',
        'fechaFinVotacion',
        'fechaEscrutinio'
      ]);
      console.log(fechasEleccion);
    }


  } else {
    console.log('Operación cancelada.');
    process.exit(0);
  }

} catch (err) {
  console.error('Error en el test de votaciones:', err);
  process.exit(1);

} finally {
  cerrarConexionBD();
  process.exit(0);
}



