class Contexto {
  constructor() {
    this._observadores = new Set();
    this._estado = {
      nombreUsuario: null,
      nombreVotante: null,
      datosUsuario: null,
      datosVotante: null,
    };
  }

  // Getters
  getEstado() {
    return { ...this._estado };
  }
  getNombreUsuario() {
    return this._estado.nombreUsuario;
  }
  getNombreVotante() {
    return this._estado.nombreVotante;
  }
  getDatosUsuario() {
    return this._estado.datosUsuario ? { ...this._estado.datosUsuario } : null;
  }
  getDatosVotante() {
    return this._estado.datosVotante ? { ...this._estado.datosVotante } : null;
  }

  // Setters
  actualizarContexto(nuevoEstado) {
    const estadoAnterior = { ...this._estado };
    Object.assign(this._estado, nuevoEstado);

    if (JSON.stringify(estadoAnterior) !== JSON.stringify(this._estado)) {
      this._notificarCambios();
    }
  }

  limpiarContexto() {
    this.actualizarContexto({
      nombreUsuario: null,
      nombreVotante: null,
      datosUsuario: null,
      datosVotante: null,
    });
  }

  // Observadores
  observarContexto(callback) {
    this._observadores.add(callback);
    return () => this._observadores.delete(callback);
  }

  _notificarCambios() {
    const estadoInmutable = this.getEstado();
    this._observadores.forEach(callback => callback(estadoInmutable));
  }
}

// Exporta una única instancia (singleton)
export const contexto = new Contexto();
