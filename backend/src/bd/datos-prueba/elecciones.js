import { addDays, subDays } from 'date-fns';

const ESTADOS = ['PENDIENTE', 'REGISTRO', 'VOTACION', 'CERRADA'];

export function cargarElecciones(bd) {
  console.log('\nIniciando carga de elecciones...');

  try {
    bd.prepare('DELETE FROM Eleccion').run();
    
    const hoy = new Date();
    
    const elecciones = [
      {
        nombre: "Elecciones Generales 2024",
        descripcion: "Elecciones al Congreso y Senado",
        fechaInicioRegistro: subDays(hoy, 60),
        fechaFinRegistro: subDays(hoy, 45),
        fechaInicioVotacion: subDays(hoy, 30),
        fechaFinVotacion: subDays(hoy, 29),
        fechaEscrutinio: subDays(hoy, 29),
        estado: "CERRADA"
      },
      {
        nombre: "Elecciones Municipales 2025",
        descripcion: "Elecciones a los Ayuntamientos",
        fechaInicioRegistro: subDays(hoy, 5),
        fechaFinRegistro: addDays(hoy, 10),
        fechaInicioVotacion: addDays(hoy, 15),
        fechaFinVotacion: addDays(hoy, 16),
        fechaEscrutinio: addDays(hoy, 16),
        estado: "REGISTRO"
      },
      {
        nombre: "Referendum Constitucional 2025",
        descripcion: "Consulta sobre la reforma constitucional",
        fechaInicioRegistro: subDays(hoy, 15),
        fechaFinRegistro: subDays(hoy, 5),
        fechaInicioVotacion: subDays(hoy, 1),
        fechaFinVotacion: addDays(hoy, 1),
        fechaEscrutinio: addDays(hoy, 1),
        estado: "VOTACION"
      },
      {
        nombre: "Elecciones Autonómicas 2025",
        descripcion: "Elecciones al Parlamento Autonómico",
        fechaInicioRegistro: addDays(hoy, 30),
        fechaFinRegistro: addDays(hoy, 45),
        fechaInicioVotacion: addDays(hoy, 60),
        fechaFinVotacion: addDays(hoy, 61),
        fechaEscrutinio: addDays(hoy, 61),
        estado: "PENDIENTE"
      }
    ];

    // Preparar statement para mejor rendimiento
    const stmt = bd.prepare(`
      INSERT INTO Eleccion (
        nombre, descripcion,
        fechaInicioRegistro, fechaFinRegistro,
        fechaInicioVotacion, fechaFinVotacion,
        fechaEscrutinio, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    bd.exec('BEGIN');

    for (const eleccion of elecciones) {
      stmt.run(
        eleccion.nombre,
        eleccion.descripcion,
        eleccion.fechaInicioRegistro.toISOString(),
        eleccion.fechaFinRegistro.toISOString(),
        eleccion.fechaInicioVotacion.toISOString(),
        eleccion.fechaFinVotacion.toISOString(),
        eleccion.fechaEscrutinio.toISOString(),
        eleccion.estado
      );
      console.log(`Creada elección: ${eleccion.nombre}`);
    }

    bd.exec('COMMIT');

    const total = bd.prepare('SELECT COUNT(*) as count FROM Eleccion').get();
    console.log(`\nTotal elecciones cargadas: ${total.count}`);

    const porEstado = bd.prepare(`
      SELECT estado, COUNT(*) as count 
      FROM Eleccion 
      GROUP BY estado
    `).all();
    
    console.log('\nDistribución por estado:');
    porEstado.forEach(({estado, count}) => {
      console.log(`- ${estado}: ${count}`);
    });

  } catch (error) {
    if (bd.inTransaction) {
      bd.exec('ROLLBACK');
    }
    console.error('\nError al cargar elecciones:', error);
    throw error;
  }
}