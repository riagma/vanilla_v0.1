export async function cargarPartidos(bd) {
  console.log('\nIniciando carga de partidos políticos...');

  try {
    await bd.run('DELETE FROM PartidoEleccion');
    await bd.run('DELETE FROM Partido');
    
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

    const stmtPartido = await bd.prepare(
      'INSERT INTO Partido (siglas, nombre, descripcion) VALUES (?, ?, ?)'
    );

    for (const partido of partidos) {
      await stmtPartido.run([partido.siglas, partido.nombre, partido.descripcion]);
      console.log(`Creado partido: ${partido.siglas}`);
    }

    await stmtPartido.finalize();

    const elecciones = await bd.all('SELECT id FROM Eleccion');
    console.log(`\nAsignando partidos a ${elecciones.length} elecciones...`);

    // Asignar partidos a elecciones
    const stmtAsignacion = await bd.prepare(
      'INSERT INTO PartidoEleccion (partidoId, eleccionId) VALUES (?, ?)'
    );

    for (const eleccion of elecciones) {
      for (const partido of partidos) {
        await stmtAsignacion.run([partido.siglas, eleccion.id]);
      }
    }

    await stmtAsignacion.finalize();

    // Mostrar resumen
    const stats = await bd.get('SELECT COUNT(*) as count FROM PartidoEleccion');
    console.log(`\nResumen:`);
    console.log(`- Partidos creados: ${partidos.length}`);
    console.log(`- Asignaciones a elecciones: ${stats.count}`);

    // Mostrar detalle de partidos
    const partidosDetalle = await bd.all(`
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
    console.error('\nError al cargar partidos:', error);
    throw error;
  }
}