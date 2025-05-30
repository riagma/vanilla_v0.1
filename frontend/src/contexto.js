// Sistema de suscripción
const observadores = new Set();

// Estado privado
const estado = {
  token: null,
  tipoUsuario: null,
  usuario: null,
  datosAdmin: null,
  datosVotante: null
};

// Getters
export const getContexto = () => ({...estado});
export const getToken = () => estado.token;
export const getTipoUsuario = () => estado.tipoUsuario;
export const getUsuario = () => estado.usuario ? {...estado.usuario} : null;
export const getDatosAdmin = () => estado.datosAdmin ? {...estado.datosAdmin} : null;
export const getDatosVotante = () => estado.datosVotante ? {...estado.datosVotante} : null;

// Función para notificar cambios
function notificarCambios() {
  const contextoInmutable = getContexto();
  observadores.forEach(callback => callback(contextoInmutable));
}

// Setters
export function actualizarContexto(nuevoEstado) {
  const estadoAnterior = {...estado};
  Object.assign(estado, nuevoEstado);
  
  if (JSON.stringify(estadoAnterior) !== JSON.stringify(estado)) {
    notificarCambios();
  }
}

export function limpiarContexto() {
  actualizarContexto({
    token: null,
    tipoUsuario: null,
    usuario: null,
    datosAdmin: null,
    datosVotante: null
  });
}

export function observarContexto(callback) {
  observadores.add(callback);
  return () => observadores.delete(callback);
}
