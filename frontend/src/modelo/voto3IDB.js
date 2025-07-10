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

        // Crear tabla votantes con clave primaria simple 'nombreUsuario'
        if (!db.objectStoreNames.contains('votantes')) {
          db.createObjectStore('votantes', { keyPath: 'nombreUsuario' });
        }

        // Crear tabla elecciones con clave primaria compuesta [nombreUsuario, eleccionId]
        if (!db.objectStoreNames.contains('elecciones')) {
          db.createObjectStore('elecciones', { keyPath: ['nombreUsuario', 'eleccionId'] });
        }
      };
    });
  }

  // CRUD para Votantes
  async crearVotante(votante) {
    const transaction = this.db.transaction(['votantes'], 'readwrite');
    const store = transaction.objectStore('votantes');
    
    return new Promise((resolve, reject) => {
      const request = store.add(votante);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async obtenerVotante(nombreUsuario) {
    console.log(`Obteniendo votante: ${nombreUsuario}`);
    const transaction = this.db.transaction(['votantes'], 'readonly');
    const store = transaction.objectStore('votantes');
    
    return new Promise((resolve, reject) => {
      const request = store.get(nombreUsuario);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async actualizarVotante(votante) {
    console.log(`Actualizando votante: ${votante.nombreUsuario}`);
    const votanteAnterior = await this.obtenerVotante(votante.nombreUsuario);
    if (!votanteAnterior) {
      throw new Error(`Votante con nombre de usuario ${votante.nombreUsuario} no encontrado`);
    }
    const votanteActualizado = { ...votanteAnterior, ...votante };
    const transaction = this.db.transaction(['votantes'], 'readwrite');
    const store = transaction.objectStore('votantes');
    
    return new Promise((resolve, reject) => {
      const request = store.put(votanteActualizado);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async eliminarVotante(nombreUsuario) {
    const transaction = this.db.transaction(['votantes'], 'readwrite');
    const store = transaction.objectStore('votantes');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(nombreUsuario);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async listarVotantes() {
    const transaction = this.db.transaction(['votantes'], 'readonly');
    const store = transaction.objectStore('votantes');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // CRUD para Elecciones (clave compuesta [nombreUsuario, eleccionId])
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

  async obtenerEleccionesPorVotante(nombreUsuario) {
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

  async actualizarEleccion(eleccion) {
    console.log(`Actualizando eleccion: ${eleccion.nombreUsuario} - ${eleccion.eleccionId}`);
    const eleccionAnterior = await this.obtenerEleccion(eleccion.nombreUsuario, eleccion.eleccionId);
    const eleccionActualizada = eleccionAnterior ? { ...eleccionAnterior, ...eleccion } : eleccion;
    const transaction = this.db.transaction(['elecciones'], 'readwrite');
    const store = transaction.objectStore('elecciones');
    
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