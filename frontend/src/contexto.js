// Sistema de suscripción
const observadores = new Set();

export const TIPOS_USUARIO = {
    ADMIN: 'ADMIN',
    VOTANTE: 'VOTANTE'
};

export const contexto = {
    token: null,
    tipoUsuario: null,
    usuario: null,
    datosAdmin: null,
    datosVotante: null
};

// Función para suscribirse a cambios
export function observarContexto(callback) {
    observadores.add(callback);
    return () => observadores.delete(callback); // Función para des-suscribirse
}

// Función para notificar cambios
export function notificarCambios() {
    observadores.forEach(callback => callback(contexto));
}

// Modificadores del contexto
export function setToken(nuevoToken) {
    contexto.token = nuevoToken;
    notificarCambios();
}

export function setUsuario(nuevoUsuario) {
    contexto.usuario = nuevoUsuario;
    notificarCambios();
}

export function logout() {
    contexto.token = null;
    contexto.tipoUsuario = null;
    contexto.usuario = null;
    contexto.datosAdmin = null;
    contexto.datosVotante = null;
    notificarCambios();
}

export function esAdmin() {
    return contexto.tipoUsuario === TIPOS_USUARIO.ADMIN;
}

export function esVotante() {
    return contexto.tipoUsuario === TIPOS_USUARIO.VOTANTE;
}
