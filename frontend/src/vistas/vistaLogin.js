import { api } from '../servicios/api.js';
import { servicioLogin } from '../servicios/servicioLogin.js';

export function vistaLogin(contenedor) {
  contenedor.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h3 class="card-title mb-0">Acceso de Votante</h3>
              <button id="btnCambiarTipo" class="btn btn-outline-secondary btn-sm">
                Admin
              </button>
            </div>
            <form id="formLogin">
              <input type="hidden" name="tipo" value="votante">
              <div id="camposAdmin" style="display:none">
                <div class="form-group mb-3">
                  <input name="correo" type="email" class="form-control" 
                         placeholder="Correo electrónico" />
                </div>
              </div>
              <div id="camposVotante">
                <div class="form-group mb-3">
                  <input name="dni" type="text" class="form-control" 
                         placeholder="DNI" />
                </div>
              </div>
              <div class="form-group mb-3">
                <input name="contrasena" type="password" class="form-control" 
                       placeholder="Contraseña" required />
              </div>
              <button type="submit" class="btn btn-primary w-100">
                Entrar
              </button>
            </form>
            <div id="mensaje" class="alert alert-danger mt-3" 
                 style="display:none"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('formLogin');
  const btnCambiarTipo = document.getElementById('btnCambiarTipo');
  const camposAdmin = document.getElementById('camposAdmin');
  const camposVotante = document.getElementById('camposVotante');
  const tipoInput = form.querySelector('input[name="tipo"]');

  function cambiarTipo() {
    const esAdmin = tipoInput.value === 'admin';
    tipoInput.value = esAdmin ? 'votante' : 'admin';
    btnCambiarTipo.textContent = esAdmin ? 'Admin' : 'Votante';
    camposAdmin.style.display = esAdmin ? 'none' : 'block';
    camposVotante.style.display = esAdmin ? 'block' : 'none';
    
    // Actualizar título según el tipo de usuario
    const titulo = document.querySelector('.card-title');
    titulo.textContent = esAdmin ? 'Acceso de Votante' : 'Acceso de Administrador';
    
    // Limpiar campos y mensaje de error al cambiar
    form.reset();
    document.getElementById('mensaje').style.display = 'none';
  }

  btnCambiarTipo.addEventListener('click', cambiarTipo);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const mensaje = document.getElementById('mensaje');
    mensaje.style.display = 'none';

    try {
      if (formData.get('tipo') === 'admin') {
        await servicioLogin.loginAdmin(
          formData.get('correo'),
          formData.get('contrasena')
        );
      } else {
        await servicioLogin.loginVotante(
          formData.get('dni'),
          formData.get('contrasena')
        );
      }
    } catch (error) {
      mensaje.textContent = error.message;
      mensaje.style.display = 'block';
    }
  });
}
