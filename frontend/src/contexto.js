export const contexto = {
  token: localStorage.getItem('token') || null
};

export function setToken(token) {
  contexto.token = token;
  localStorage.setItem('token', token);
}

export function limpiarSesion() {
  contexto.token = null;
  localStorage.removeItem('token');
}
