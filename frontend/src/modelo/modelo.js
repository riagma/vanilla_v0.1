// Modelo para la tabla de usuarios
export class Usuario {
  constructor({ nombre, passwordHash }) {
    this.nombre = nombre; // string, único
    this.passwordHash = passwordHash; // string, hash seguro (ej: SHA-256/base64)
    // Puedes añadir más campos aquí en el futuro
  }
}

// Modelo para la tabla de elecciones
// Clave compuesta: [nombre, eleccionId]
export class EleccionUsuario {
  constructor({ nombre, eleccionId }) {
    this.nombre = nombre; // string, referencia a Usuario.nombre
    this.eleccionId = eleccionId; // number, identificador de la elección
    // Puedes añadir más campos aquí en el futuro
  }
}

// Ejemplo de clave compuesta para EleccionUsuario:
// { nombre: 'usuario1', eleccionId: 42 }