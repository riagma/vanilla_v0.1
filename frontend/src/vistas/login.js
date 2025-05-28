import { api } from '../servicios/api.js';

export function loginForm(contenedor, onLogin) {
  contenedor.innerHTML = `
    <form id="formLogin">
      <input name="usuario" placeholder="Usuario" required />
      <input name="clave" type="password" placeholder="Clave" required />
      <button type="submit">Entrar</button>
    </form>
    <p id="mensaje" style="color:red;"></p>
  `;

  document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
    const usuario = e.target.usuario.value;
    const clave = e.target.clave.value;

    try {
      const res = await api.post('/api/login', { usuario, clave });
      onLogin(res.token);
    } catch (err) {
      document.getElementById('mensaje').textContent = 'Login incorrecto';
    }
  });
}
