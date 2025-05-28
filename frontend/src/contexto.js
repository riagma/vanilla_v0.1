export const contexto = {
  token: null
};

export function setToken(token) {
  contexto.token = token;
  localStorage.setItem('token', token);
}

export function logout() {
  contexto.token = null;
  localStorage.removeItem('token');
  location.hash = '#/';  // Redirige al login
}
