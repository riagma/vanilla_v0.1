const DB_NAME = 'Voto3';
const DB_VERSION = 1;

class ServicioIndexedDB {
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

        // Crear tabla votantes con clave primaria simple 'nombre'
        if (!db.objectStoreNames.contains('votantes')) {
          db.createObjectStore('votantes', { keyPath: 'nombre' });
        }

        // Crear tabla elecciones con clave primaria compuesta [nombre, eleccionId]
        if (!db.objectStoreNames.contains('elecciones')) {
          db.createObjectStore('elecciones', { keyPath: ['nombre', 'eleccionId'] });
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

  async obtenerVotante(nombre) {
    const transaction = this.db.transaction(['votantes'], 'readonly');
    const store = transaction.objectStore('votantes');
    
    return new Promise((resolve, reject) => {
      const request = store.get(nombre);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async actualizarVotante(votante) {
    const transaction = this.db.transaction(['votantes'], 'readwrite');
    const store = transaction.objectStore('votantes');
    
    return new Promise((resolve, reject) => {
      const request = store.put(votante);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async eliminarVotante(nombre) {
    const transaction = this.db.transaction(['votantes'], 'readwrite');
    const store = transaction.objectStore('votantes');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(nombre);
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

  // CRUD para Elecciones (clave compuesta [nombre, eleccionId])
  async crearEleccion(eleccion) {
    const transaction = this.db.transaction(['elecciones'], 'readwrite');
    const store = transaction.objectStore('elecciones');
    
    return new Promise((resolve, reject) => {
      const request = store.add(eleccion);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async obtenerEleccion(nombre, eleccionId) {
    const transaction = this.db.transaction(['elecciones'], 'readonly');
    const store = transaction.objectStore('elecciones');
    
    return new Promise((resolve, reject) => {
      const request = store.get([nombre, eleccionId]);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async obtenerEleccionesPorVotante(nombre) {
    const transaction = this.db.transaction(['elecciones'], 'readonly');
    const store = transaction.objectStore('elecciones');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const todasElecciones = request.result;
        const eleccionesVotante = todasElecciones.filter(e => e.nombre === nombre);
        resolve(eleccionesVotante);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async actualizarEleccion(eleccion) {
    const transaction = this.db.transaction(['elecciones'], 'readwrite');
    const store = transaction.objectStore('elecciones');
    
    return new Promise((resolve, reject) => {
      const request = store.put(eleccion);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async eliminarEleccion(nombre, eleccionId) {
    const transaction = this.db.transaction(['elecciones'], 'readwrite');
    const store = transaction.objectStore('elecciones');
    
    return new Promise((resolve, reject) => {
      const request = store.delete([nombre, eleccionId]);
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
export const servicioIndexedDB = new ServicioIndexedDB();