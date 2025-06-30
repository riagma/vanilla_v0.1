import { addDays, subDays } from 'date-fns';
import { encriptar, generarParClavesRSA } from '../../utiles/utilesCrypto.js';
import { CLAVE_MAESTRA } from '../../utiles/constantes.js'; 

// const ESTADOS = ['PENDIENTE', 'REGISTRO', 'VOTACION', 'CERRADA'];

export async function cargarElecciones(bd) {
  console.log('\nIniciando carga de elecciones...');

  try {
    bd.prepare('DELETE FROM Eleccion').run();
    
    const { clavePublica, clavePrivada } = await generarParClavesRSA();
    
    const elecciones = [
      {
        nombre: "Elecciones Generales 2024",
        descripcion: "Elecciones al Congreso y Senado",
        fechaInicioRegistro: null,
        fechaFinRegistro: null,
        fechaInicioVotacion: null,
        fechaFinVotacion: null,
        fechaEscrutinio: null,
        claveVotoPublica: clavePublica,
        claveVotoPrivadaEncriptada: await encriptar(clavePrivada, CLAVE_MAESTRA),
        claveVotoPrivada: null,
      },
      {
        nombre: "Elecciones Municipales 2025",
        descripcion: "Elecciones a los Ayuntamientos",
        fechaInicioRegistro: null,
        fechaFinRegistro: null,
        fechaInicioVotacion: null,
        fechaFinVotacion: null,
        fechaEscrutinio: null,
        claveVotoPublica: clavePublica,
        claveVotoPrivadaEncriptada: await encriptar(clavePrivada, CLAVE_MAESTRA),
        claveVotoPrivada: null,
      },
      {
        nombre: "Referendum Constitucional 2025",
        descripcion: "Consulta sobre la reforma constitucional",
        fechaInicioRegistro: null,
        fechaFinRegistro: null,
        fechaInicioVotacion: null,
        fechaFinVotacion: null,
        fechaEscrutinio: null,
        claveVotoPublica: clavePublica,
        claveVotoPrivadaEncriptada: await encriptar(clavePrivada, CLAVE_MAESTRA),
        claveVotoPrivada: null,
      },
      {
        nombre: "Elecciones Autonómicas 2025",
        descripcion: "Elecciones al Parlamento Autonómico",
        fechaInicioRegistro: null,
        fechaFinRegistro: null,
        fechaInicioVotacion: null,
        fechaFinVotacion: null,
        fechaEscrutinio: null,
        claveVotoPublica: clavePublica,
        claveVotoPrivadaEncriptada: await encriptar(clavePrivada, CLAVE_MAESTRA),
        claveVotoPrivada: null,
      }
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
        null, null, null, null, null,
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