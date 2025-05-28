export async function cargarPartidos(db) {
  console.log('\n🏛️  Iniciando carga de partidos políticos...');

  try {
    // Limpiar tablas
    await db.run('DELETE FROM PartidoEleccion');
    await db.run('DELETE FROM Partido');
    
    // Partidos políticos de ejemplo
    const partidos = [
      {
        nombre: 'Partido Progreso Democrático',
        siglas: 'PPD',
        descripcion: 'Partido centrado en el desarrollo sostenible y la innovación social'
      },
      {
        nombre: 'Unión Liberal Reformista',
        siglas: 'ULR',
        descripcion: 'Partido enfocado en reformas económicas y libertades individuales'
      },
      {
        nombre: 'Alianza Verde Ciudadana',
        siglas: 'AVC',
        descripcion: 'Partido comprometido con la protección del medio ambiente'
      },
      {
        nombre: 'Movimiento Solidario Nacional',
        siglas: 'MSN',
        descripcion: 'Partido centrado en políticas sociales y bienestar comunitario'
      }
    ];

    // Insertar partidos
    const stmtPartido = await db.prepare(
      'INSERT INTO Partido (siglas, nombre, descripcion) VALUES (?, ?, ?)'
    );

    for (const partido of partidos) {
      await stmtPartido.run([partido.siglas, partido.nombre, partido.descripcion]);
      console.log(`✔ Creado partido: ${partido.siglas}`);
    }

    await stmtPartido.finalize();

    // Obtener todas las elecciones
    const elecciones = await db.all('SELECT id FROM Eleccion');
    console.log(`\n🔄 Asignando partidos a ${elecciones.length} elecciones...`);

    // Asignar partidos a elecciones
    const stmtAsignacion = await db.prepare(
      'INSERT INTO PartidoEleccion (partidoId, eleccionId) VALUES (?, ?)'
    );

    for (const eleccion of elecciones) {
      for (const partido of partidos) {
        await stmtAsignacion.run([partido.siglas, eleccion.id]);
      }
    }

    await stmtAsignacion.finalize();

    // Mostrar resumen
    const stats = await db.get('SELECT COUNT(*) as count FROM PartidoEleccion');
    console.log(`\n📊 Resumen:`);
    console.log(`- Partidos creados: ${partidos.length}`);
    console.log(`- Asignaciones a elecciones: ${stats.count}`);

    // Mostrar detalle de partidos
    const partidosDetalle = await db.all(`
      SELECT p.siglas, p.nombre, COUNT(pe.eleccionId) as numElecciones
      FROM Partido p
      LEFT JOIN PartidoEleccion pe ON p.siglas = pe.partidoId
      GROUP BY p.siglas
      ORDER BY p.siglas
    `);

    console.log('\nDetalle de partidos:');
    partidosDetalle.forEach(p => {
      console.log(`- ${p.siglas}: presente en ${p.numElecciones} elecciones`);
    });

  } catch (error) {
    console.error('\n❌ Error al cargar partidos:', error);
    throw error;
  }
}