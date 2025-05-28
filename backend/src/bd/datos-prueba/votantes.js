import { faker } from '@faker-js/faker/locale/es';
import bcrypt from 'bcrypt';
import { daos } from '../daos.js';

// Función para normalizar texto (quitar tildes y caracteres especiales)
function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_');
}

export async function cargarVotantes(db, cantidad = 100) {
  console.log(`Iniciando carga de ${cantidad} votantes...`);

  try {
    // Limpiar tabla antes de insertar
    await db.run('DELETE FROM Votante');
    
    for (let i = 0; i < cantidad; i++) {
      const nombre = faker.person.firstName();
      const apellidos = faker.person.lastName().split(' ');
      const primerApellido = apellidos[0];
      const segundoApellido = apellidos[1] || faker.person.lastName();

      // Generar correo electrónico
      const nombreEmail = normalizarTexto(nombre);
      const apellidosEmail = `${normalizarTexto(primerApellido)}.${normalizarTexto(segundoApellido)}`;
      const correoElectronico = `${nombreEmail}.${apellidosEmail}@ejemplo.com`;

      // Generar DNI español
      const numeroDNI = faker.number.int({ min: 0, max: 99999999 }).toString().padStart(8, '0');
      const letrasDNI = 'TRWAGMYFPDXBNJZSQVHLCKE';
      const letraDNI = letrasDNI[numeroDNI % 23];
      const dni = `${numeroDNI}${letraDNI}`;

      // Crear hash de contraseña
      const hashContrasena = await bcrypt.hash('Password123!', 10);

      // Insertar votante
      await daos.votante.crear(db, {
        dni,
        nombre,
        primerApellido,
        segundoApellido,
        correoElectronico,
        hashContrasena
      });

      if (i % 10 === 0) {
        process.stdout.write('.');
      }
    }
    console.log('\n✅ Votantes creados exitosamente.');

    // Mostrar algunos ejemplos
    const ejemplos = await db.all('SELECT * FROM Votante LIMIT 5');
    console.log('\nEjemplos de votantes creados:');
    ejemplos.forEach(v => {
      console.log(`- ${v.nombre} ${v.primerApellido} (${v.dni}) - ${v.correoElectronico}`);
    });

  } catch (error) {
    console.error('Error al cargar votantes:', error);
    throw error;
  }
}