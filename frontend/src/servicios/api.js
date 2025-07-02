import { contexto } from '../contexto.js';

const BASE = '';

async function llamarApi(ruta, opciones = {}) {
  const headers = opciones.headers || {};
  const token = contexto.getToken();
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (opciones.body && !(opciones.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    opciones.body = JSON.stringify(opciones.body);
  }

  const res = await fetch(BASE + ruta, {
    method: opciones.method || 'GET',
    headers,
    body: opciones.body || null
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || res.statusText);
  }

  return res.json();
}

export const api = {
  get: (ruta) => llamarApi(ruta),
  post: (ruta, body) => llamarApi(ruta, { method: 'POST', body }),
  put: (ruta, body) => llamarApi(ruta, { method: 'PUT', body }),
  del: (ruta) => llamarApi(ruta, { method: 'DELETE' })
};
