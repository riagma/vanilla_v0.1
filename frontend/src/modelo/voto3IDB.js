const DB_NAME = 'Voto3';
const DB_VERSION = 1;

class Voto3IDB {
  constructor() {
    this.db = null;
  }

  // Inicializar la base de datos
  async inicializar() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Crear tabla usuarios con clave primaria simple 'nombreUsuario'
        if (!db.objectStoreNames.contains('usuarios')) {
          db.createObjectStore('usuarios', { keyPath: 'nombreUsuario' });
        }

        // Crear tabla elecciones con clave primaria compuesta [nombreUsuario, eleccionId]
        if (!db.objectStoreNames.contains('elecciones')) {
          db.createObjectStore('elecciones', { keyPath: ['nombreUsuario', 'eleccionId'] });
        }
      };
    });
  }

  async crearUsuario(usuario) {
    const transaction = this.db.transaction(['usuarios'], 'readwrite');
    const store = transaction.objectStore('usuarios');
    
    return new Promise((resolve, reject) => {
      const request = store.add(usuario);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async obtenerUsuario(nombreUsuario) {
    console.log(`Obteniendo usuario: ${nombreUsuario}`);
    let transaction, store;
    try {
      transaction = this.db.transaction(['usuarios'], 'readonly');
      store = transaction.objectStore('usuarios');
    } catch (error) {
      if (error && error.name === 'NotFoundError') {
        throw new Error("La store 'usuarios' no existe en la base de datos IndexedDB");
      }
      throw new Error("Error al abrir la transacción de 'usuarios': " + error.message);
    }

    return new Promise((resolve, reject) => {
      const request = store.get(nombreUsuario);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async actualizarUsuario(nombreUsuario, usuario) {
    console.log(`Actualizando usuario: ${nombreUsuario}`);
    const usuarioNuevo = { ...usuario, nombreUsuario };
    const usuarioAnterior = await this.obtenerUsuario(nombreUsuario);
    const usuarioActualizado = usuarioAnterior ? { ...usuarioAnterior, ...usuarioNuevo } : usuarioNuevo;
    const transaction = this.db.transaction(['usuarios'], 'readwrite');
    const store = transaction.objectStore('usuarios');
    console.log('Votante actualizado:', usuarioActualizado);
    return new Promise((resolve, reject) => {
      const request = store.put(usuarioActualizado);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async eliminarUsuario(nombreUsuario) {
    const transaction = this.db.transaction(['usuarios'], 'readwrite');
    const store = transaction.objectStore('usuarios');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(nombreUsuario);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async listarUsuarios() {
    const transaction = this.db.transaction(['usuarios'], 'readonly');
    const store = transaction.objectStore('usuarios');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async crearEleccion(eleccion) {
    const transaction = this.db.transaction(['elecciones'], 'readwrite');
    const store = transaction.objectStore('elecciones');
    
    return new Promise((resolve, reject) => {
      const request = store.add(eleccion);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async obtenerEleccion(nombreUsuario, eleccionId) {
    const transaction = this.db.transaction(['elecciones'], 'readonly');
    const store = transaction.objectStore('elecciones');
    
    return new Promise((resolve, reject) => {
      const request = store.get([nombreUsuario, eleccionId]);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async obtenerEleccionesPorUsuario(nombreUsuario) {
    const transaction = this.db.transaction(['elecciones'], 'readonly');
    const store = transaction.objectStore('elecciones');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const todasElecciones = request.result;
        const eleccionesVotante = todasElecciones.filter(e => e.nombreUsuario === nombreUsuario);
        resolve(eleccionesVotante);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async actualizarEleccion(nombreUsuario, eleccionId, eleccion) {
    console.log(`Actualizando eleccion: ${nombreUsuario} - ${eleccionId}`);
    const eleccionNueva = { ...eleccion, nombreUsuario, eleccionId };
    const eleccionAnterior = await this.obtenerEleccion(nombreUsuario, eleccionId);
    const eleccionActualizada = eleccionAnterior ? { ...eleccionAnterior, ...eleccionNueva } : eleccionNueva;
    const transaction = this.db.transaction(['elecciones'], 'readwrite');
    const store = transaction.objectStore('elecciones');
    console.log('Elección actualizada:', eleccionActualizada);
    return new Promise((resolve, reject) => {
      const request = store.put(eleccionActualizada);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async eliminarEleccion(nombreUsuario, eleccionId) {
    const transaction = this.db.transaction(['elecciones'], 'readwrite');
    const store = transaction.objectStore('elecciones');
    
    return new Promise((resolve, reject) => {
      const request = store.delete([nombreUsuario, eleccionId]);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async listarElecciones() {
    const transaction = this.db.transaction(['elecciones'], 'readonly');
    const store = transaction.objectStore('elecciones');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Instancia singleton
export const voto3IDB = new Voto3IDB();