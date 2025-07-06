import { addDays, subDays } from 'date-fns';
import { encriptar, generarParClavesRSA } from '../../utiles/utilesCrypto.js';
import { CLAVE_MAESTRA } from '../../utiles/constantes.js'; 
import { formatearFechaHora } from '../../utiles/utilesFechas.js';

// const ESTADOS = ['PENDIENTE', 'REGISTRO', 'VOTACION', 'CERRADA'];

const ahora = new Date();
const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0);

export async function cargarElecciones(bd) {
  console.log('\nIniciando carga de elecciones...');

  try {
    bd.prepare('DELETE FROM Eleccion').run();
    
    const { clavePublica, clavePrivada } = await generarParClavesRSA();
    
    const elecciones = [
      {
        nombre: "Elecciones Municipales 2025",
        descripcion: "Elecciones a los Ayuntamientos",
        fechaInicioRegistro: formatearFechaHora(hoy, { incDD: -62 }),
        fechaFinRegistro: formatearFechaHora(hoy, { incDD: -42 }),
        fechaInicioVotacion: formatearFechaHora(hoy, { incDD: -41 }),
        fechaFinVotacion: formatearFechaHora(hoy, { incDD: -31 }),
        fechaEscrutinio: formatearFechaHora(hoy, { incDD: -30 }),
        claveVotoPublica: clavePublica,
        claveVotoPrivadaEncriptada: await encriptar(clavePrivada, CLAVE_MAESTRA),
        claveVotoPrivada: null,
      },
      {
        nombre: "Elecciones Autonómicas 2025",
        descripcion: "Elecciones al Parlamento Autonómico",
        fechaInicioRegistro: formatearFechaHora(hoy, { incDD: -22 }),
        fechaFinRegistro: formatearFechaHora(hoy, { incDD: -2 }),
        fechaInicioVotacion: formatearFechaHora(hoy, { incDD: -1 }),
        fechaFinVotacion: formatearFechaHora(hoy, { incDD: 9 }),
        fechaEscrutinio: formatearFechaHora(hoy, { incDD: -10 }),
        claveVotoPublica: clavePublica,
        claveVotoPrivadaEncriptada: await encriptar(clavePrivada, CLAVE_MAESTRA),
        claveVotoPrivada: null,
      },
      {
        nombre: "Elecciones Generales 2025",
        descripcion: "Elecciones al Congreso y Senado",
        fechaInicioRegistro: formatearFechaHora(hoy, { incDD: -1 }),
        fechaFinRegistro: formatearFechaHora(hoy, { incDD: 21 }),
        fechaInicioVotacion: formatearFechaHora(hoy, { incDD: 22 }),
        fechaFinVotacion: formatearFechaHora(hoy, { incDD: 32 }),
        fechaEscrutinio: formatearFechaHora(hoy, { incDD: 33 }),
        claveVotoPublica: clavePublica,
        claveVotoPrivadaEncriptada: await encriptar(clavePrivada, CLAVE_MAESTRA),
        claveVotoPrivada: null,
      },
      {
        nombre: "Referendum Constitucional 2025",
        descripcion: "Consulta sobre la reforma constitucional",
        fechaInicioRegistro: formatearFechaHora(hoy, { incDD: 30 }),
        fechaFinRegistro: formatearFechaHora(hoy, { incDD: 50 }),
        fechaInicioVotacion: formatearFechaHora(hoy, { incDD: 51 }),
        fechaFinVotacion: formatearFechaHora(hoy, { incDD: 61 }),
        fechaEscrutinio: formatearFechaHora(hoy, { incDD: 62 }),
        claveVotoPublica: clavePublica,
        claveVotoPrivadaEncriptada: await encriptar(clavePrivada, CLAVE_MAESTRA),
        claveVotoPrivada: null,
      },
    ];

    // Preparar statement para mejor rendimiento
    const stmt = bd.prepare(`
      INSERT INTO Eleccion (
        nombre, descripcion,
        fechaInicioRegistro, fechaFinRegistro,
        fechaInicioVotacion, fechaFinVotacion, fechaEscrutinio, 
        claveVotoPublica, claveVotoPrivadaEncriptada, claveVotoPrivada
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    bd.exec('BEGIN');

    for (const eleccion of elecciones) {
      stmt.run(
        eleccion.nombre,
        eleccion.descripcion,
        eleccion.fechaInicioRegistro,
        eleccion.fechaFinRegistro,
        eleccion.fechaInicioVotacion,
        eleccion.fechaFinVotacion,
        eleccion.fechaEscrutinio,
        eleccion.claveVotoPublica, 
        eleccion.claveVotoPrivadaEncriptada, 
        null
      );
      console.log(`Creada elección: ${eleccion.nombre}`);
    }

    bd.exec('COMMIT');

    const total = bd.prepare('SELECT COUNT(*) as count FROM Eleccion').get();
    console.log(`\nTotal elecciones cargadas: ${total.count}`);

    // const porEstado = bd.prepare(`
    //   SELECT estado, COUNT(*) as count 
    //   FROM Eleccion 
    //   GROUP BY estado
    // `).all();
    
    // console.log('\nDistribución por estado:');
    // porEstado.forEach(({estado, count}) => {
    //   console.log(`- ${estado}: ${count}`);
    // });

  } catch (error) {
    if (bd.inTransaction) {
      bd.exec('ROLLBACK');
    }
    console.error('\nError al cargar elecciones:', error);
    throw error;
  }
}