import { obtenerDB } from '../bd.js';
import { cargarVotantes } from '../datos-prueba/votantes.js';
import { cargarElecciones } from '../datos-prueba/elecciones.js';
import { cargarPartidos } from '../datos-prueba/partidos.js';

async function cargarDatosPrueba() {
  const args = process.argv.slice(2);
  const cantidad = args[0] ? parseInt(args[0], 10) : 100;

  if (isNaN(cantidad) || cantidad <= 0) {
    console.error(`Cantidad inválida: ${args[0]}`);
    process.exit(1);
  }

  console.log('Iniciando carga de datos de prueba...');
  const bd = await obtenerDB();

  try {
    // Cargar datos en orden por dependencias
    await cargarVotantes(bd, cantidad);
    await cargarElecciones(bd);
    await cargarPartidos(bd);

    // Actualizar resumen final para incluir partidos
    const stats = await bd.all(`
      SELECT 'Votantes' as tabla, COUNT(*) as total FROM Votante
      UNION ALL
      SELECT 'Elecciones', COUNT(*) FROM Eleccion
      UNION ALL
      SELECT 'Partidos', COUNT(*) FROM Partido
      UNION ALL
      SELECT 'Asignaciones', COUNT(*) FROM PartidoEleccion
    `);

    console.log('Datos de prueba cargados exitosamente.', stats);
  } catch (error) {
    console.error('Error al cargar datos de prueba:', error);
    process.exit(1);
  } finally {
    await bd.close();
  }
}

cargarDatosPrueba();