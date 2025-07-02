import { servicioLogin } from '../servicios/servicioLogin.js';
import { navegarA } from '../rutas/enrutado.js';
import { limpiarManejadores } from '../utiles/utiles.js';

export function vistaLogin(contenedor) {
  let manejadores = new Set();
  let modoRegistro = false;

  function renderizar() {
    contenedor.innerHTML = `
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="card-title mb-0">Acceso Usuario Voto3</h3>
                <button id="botonNuevo" class="btn btn-outline-secondary btn-sm">
                  ${modoRegistro ? 'Cancelar' : 'Nuevo'}
                </button>
              </div>
              ${modoRegistro ? `
                <form id="formularioRegistro">
                  <div class="form-group mb-3">
                    <input name="nombre" type="text" class="form-control" placeholder="Nombre de usuario único" required />
                  </div>
                  <div class="form-group mb-3">
                    <input name="contrasena" type="password" class="form-control" placeholder="Contraseña" required />
                  </div>
                  <div class="form-group mb-3">
                    <input name="repetirContrasena" type="password" class="form-control" placeholder="Repetir contraseña" required />
                  </div>
                  <div class="form-group mb-3">
                    <input name="dni" type="text" class="form-control" placeholder="DNI" required />
                  </div>
                  <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-success">Crear</button>
                    <button type="button" class="btn btn-secondary" id="botonCancelar">Cancelar</button>
                  </div>
                  <div class="alert alert-info mt-3" style="font-size: 0.95em;">
                    <strong>Nota:</strong> El usuario es <b>local</b> y puede tener cualquier nombre no existente previamente en este navegador.
                    Cada vez que la aplicación se conecte con el servidor de <b>Voto3</b>, se solicitarán las credenciales del servicio, salvo que se hayan almacenado previamente en el usuario local. En cualquier caso, siempre se pedirá permiso para realizar dicha conexión.
                  </div>
                </form>
              ` : `
                <form id="formularioLogin">
                  <div class="form-group mb-3">
                    <input name="nombre" type="text" class="form-control" placeholder="Nombre de usuario" required />
                  </div>
                  <div class="form-group mb-3">
                    <div class="input-group">
                      <input name="contrasena" type="password" class="form-control" placeholder="Contraseña" required />
                      <span class="input-group-text bg-transparent" role="button" id="botonMostrarContrasena" style="cursor: pointer">
                        <i class="bi bi-eye"></i>
                      </span>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary w-100">Entrar</button>
                </form>
              `}
              <div id="mensajeError" class="alert alert-danger mt-3" style="display:none"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function inicializarManejadores() {
    const botonNuevo = document.getElementById('botonNuevo');
    botonNuevo.addEventListener('click', () => {
      modoRegistro = !modoRegistro;
      renderizar();
      inicializarManejadores();
    });
    manejadores.add([botonNuevo, 'click', () => {}]); // Dummy para limpieza

    const mensajeError = document.getElementById('mensajeError');

    if (modoRegistro) {
      const formularioRegistro = document.getElementById('formularioRegistro');
      const botonCancelar = document.getElementById('botonCancelar');

      formularioRegistro.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        mensajeError.style.display = 'none';

        const datos = new FormData(evento.target);
        const nombre = datos.get('nombre');
        const contrasena = datos.get('contrasena');
        const repetirContrasena = datos.get('repetirContrasena');
        const dni = datos.get('dni');

        if (contrasena !== repetirContrasena) {
          mensajeError.textContent = 'Las contraseñas no coinciden.';
          mensajeError.style.display = 'block';
          return;
        }

        try {
          await servicioLogin.registrarVotante(nombre, contrasena, repetirContrasena, dni);
          navegarA('/v');
        } catch (error) {
          mensajeError.textContent = error.message || 'Error al crear usuario.';
          mensajeError.style.display = 'block';
        }
      });
      manejadores.add([formularioRegistro, 'submit', () => {}]);

      botonCancelar.addEventListener('click', () => {
        modoRegistro = false;
        renderizar();
        inicializarManejadores();
      });
      manejadores.add([botonCancelar, 'click', () => {}]);
    } else {
      const formulario = document.getElementById('formularioLogin');
      const botonMostrarContrasena = document.getElementById('botonMostrarContrasena');
      const campoContrasena = formulario.querySelector('input[name="contrasena"]');

      formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        mensajeError.style.display = 'none';

        const datos = new FormData(evento.target);
        try {
          await servicioLogin.loginVotante(datos.get('nombre'), datos.get('contrasena'));
          navegarA('/v');
        } catch (error) {
          mensajeError.textContent = error.message || 'Error de autenticación.';
          mensajeError.style.display = 'block';
        }
      });
      manejadores.add([formulario, 'submit', () => {}]);

      botonMostrarContrasena.addEventListener('click', () => {
        const tipo = campoContrasena.type === 'password' ? 'text' : 'password';
        campoContrasena.type = tipo;
        botonMostrarContrasena.innerHTML = `<i class="bi bi-eye${tipo === 'password' ? '' : '-slash'}"></i>`;
      });
      manejadores.add([botonMostrarContrasena, 'click', () => {}]);
    }
  }

  // Renderizado inicial
  renderizar();
  inicializarManejadores();

  // Retornar función de limpieza
  return () => {
    limpiarManejadores(manejadores);
  };
}
