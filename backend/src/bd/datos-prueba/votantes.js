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

export async function cargarVotantes(bd, cantidad = 100) {
  console.log(`Iniciando carga de ${cantidad} votantes...`);

  try {
    await bd.run('DELETE FROM Votante');
    
    for (let i = 0; i < cantidad; i++) {
      const nombre = faker.person.firstName();
      const apellidos = faker.person.lastName().split(' ');
      const primerApellido = apellidos[0];
      const segundoApellido = apellidos[1] || faker.person.lastName();

      const nombreEmail = normalizarTexto(nombre);
      const apellidosEmail = `${normalizarTexto(primerApellido)}.${normalizarTexto(segundoApellido)}`;
      const correoElectronico = `${nombreEmail}.${apellidosEmail}@ejemplo.com`;

      const numeroDNI = faker.number.int({ min: 0, max: 99999999 }).toString().padStart(8, '0');
      const letrasDNI = 'TRWAGMYFPDXBNJZSQVHLCKE';
      const letraDNI = letrasDNI[numeroDNI % 23];
      const dni = `${numeroDNI}${letraDNI}`;

      const hashContrasena = await bcrypt.hash('Password123!', 10);

      // Insertar votante
      await daos.votante.crear(bd, {
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
    console.log('\nVotantes creados exitosamente.');

    const ejemplos = await bd.all('SELECT * FROM Votante LIMIT 5');
    console.log('\nEjemplos de votantes creados:');
    ejemplos.forEach(v => {
      console.log(`- ${v.nombre} ${v.primerApellido} (${v.dni}) - ${v.correoElectronico}`);
    });

  } catch (error) {
    console.error('Error al cargar votantes:', error);
    throw error;
  }
}