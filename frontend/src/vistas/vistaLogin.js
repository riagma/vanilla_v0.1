import { servicioLogin } from '../servicios/servicioLogin.js';
import { navegarA } from '../rutas/enrutado.js';
import { limpiarManejadores } from '../utiles/utiles.js';

export function vistaLogin(contenedor) {
  let manejadores = new Set();
  let esAdmin = false;

  function renderizar() {
    contenedor.innerHTML = `
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="card-title mb-0">${esAdmin ? 'Acceso de Administrador' : 'Acceso de Votante'}</h3>
                <button id="botonCambiarTipo" class="btn btn-outline-secondary btn-sm">
                  ${esAdmin ? 'Votante' : 'Admin'}
                </button>
              </div>
              <form id="formularioLogin">
                <input type="hidden" name="tipo" value="${esAdmin ? 'admin' : 'votante'}">
                <div id="camposAdmin" style="display:${esAdmin ? 'block' : 'none'}">
                  <div class="form-group mb-3">
                    <input name="correo" type="email" class="form-control" 
                           placeholder="Correo electrónico" />
                  </div>
                </div>
                <div id="camposVotante" style="display:${esAdmin ? 'none' : 'block'}">
                  <div class="form-group mb-3">
                    <input name="dni" type="text" class="form-control" 
                           placeholder="DNI" />
                  </div>
                </div>
                <div class="form-group mb-3">
                  <div class="input-group">
                    <input name="contrasena" type="password" 
                           class="form-control" 
                           placeholder="Contraseña" 
                           required />
                    <span class="input-group-text bg-transparent" 
                          role="button" 
                          id="botonMostrarContrasena"
                          style="cursor: pointer">
                      <i class="bi bi-eye"></i>
                    </span>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary w-100">
                  Entrar
                </button>
              </form>
              <div id="mensajeError" class="alert alert-danger mt-3" style="display:none"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function inicializarManejadores() {
    const formulario = document.getElementById('formularioLogin');
    const botonCambiarTipo = document.getElementById('botonCambiarTipo');
    const botonMostrarContrasena = document.getElementById('botonMostrarContrasena');
    const campoContrasena = formulario.querySelector('input[name="contrasena"]');
    // const camposAdmin = document.getElementById('camposAdmin');
    // const camposVotante = document.getElementById('camposVotante');
    // const campoTipo = formulario.querySelector('input[name="tipo"]');

    const manejarEnvio = async (evento) => {
      evento.preventDefault();
      const datos = new FormData(evento.target);
      const mensajeError = document.getElementById('mensajeError');
      mensajeError.style.display = 'none';

      try {
        if (datos.get('tipo') === 'admin') {
          await servicioLogin.loginAdmin(datos.get('correo'), datos.get('contrasena'));
        } else {
          await servicioLogin.loginVotante(datos.get('dni'), datos.get('contrasena'));
        }
        navegarA('/elecciones');
      } catch (error) {
        mensajeError.textContent = error.message;
        mensajeError.style.display = 'block';
      }
    };

    const manejarCambioTipo = () => {
      esAdmin = !esAdmin;
      renderizar();
      inicializarManejadores();
    };

    const manejarMostrarContrasena = () => {
      const tipo = campoContrasena.type === 'password' ? 'text' : 'password';
      campoContrasena.type = tipo;
      botonMostrarContrasena.innerHTML = `<i class="bi bi-eye${tipo === 'password' ? '' : '-slash'}"></i>`;
    };

    formulario.addEventListener('submit', manejarEnvio);
    manejadores.add([formulario, 'submit', manejarEnvio]);

    botonCambiarTipo.addEventListener('click', manejarCambioTipo);
    manejadores.add([botonCambiarTipo, 'click', manejarCambioTipo]);

    botonMostrarContrasena.addEventListener('click', manejarMostrarContrasena);
    manejadores.add([botonMostrarContrasena, 'click', manejarMostrarContrasena]);
  }

  // Renderizado inicial
  renderizar();
  inicializarManejadores();

  // Retornar función de limpieza
  return () => {
    console.log('Limpiando vista login');
    limpiarManejadores(manejadores);
  };
}
