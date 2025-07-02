class Contexto {
  constructor() {
    this._observadores = new Set();
    this._estado = {
      token: null,
      tipoUsuario: null,
      usuario: null,
      datosAdmin: null,
      datosVotante: null
    };
  }

  // Getters
  getContexto() {
    return { ...this._estado };
  }
  getToken() {
    return this._estado.token;
  }
  getTipoUsuario() {
    return this._estado.tipoUsuario;
  }
  getUsuario() {
    return this._estado.usuario ? { ...this._estado.usuario } : null;
  }
  getDatosAdmin() {
    return this._estado.datosAdmin ? { ...this._estado.datosAdmin } : null;
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
      token: null,
      tipoUsuario: null,
      usuario: null,
      datosAdmin: null,
      datosVotante: null
    });
  }

  // Observadores
  observarContexto(callback) {
    this._observadores.add(callback);
    return () => this._observadores.delete(callback);
  }

  _notificarCambios() {
    const contextoInmutable = this.getContexto();
    this._observadores.forEach(callback => callback(contextoInmutable));
  }
}

// Exporta una única instancia (singleton)
export const contexto = new Contexto();
