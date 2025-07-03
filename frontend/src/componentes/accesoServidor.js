import { contexto } from '../modelo/contexto.js';
import { voto3IDB as idb } from '../modelo/voto3IDB.js';
import { servicioLogin } from '../servicios/servicioLogin.js';
import { servicioVotante } from '../servicios/servicioVotante.js';
import { encriptar, desencriptar } from '../utiles/utilesCrypto.js';

export async function notificarAccesoIdentificado(titulo = 'Acceso al servidor de Voto3') {
  const nombreUsuario = contexto.getNombreUsuario();
  if (!nombreUsuario) {
    throw new Error('No hay usuario autenticado');
  }
  const votante = await idb.obtenerVotante(nombreUsuario);
  if (!votante) {
    throw new Error('Votante no encontrado en la base de datos');
  }
  let credenciales = null;
  if (votante.credenciales) {
    credenciales = desencriptar(votante.credenciales, servicioLogin.getClaveDerivada());
  }

  console.log('Notificando acceso al servidor Voto3 para:', nombreUsuario);

  return new Promise(resolve => {
    const modal = document.createElement('div');
    modal.className = 'modal fade'; modal.tabIndex = -1;
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${titulo}</h5>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="dniInput" class="form-label">DNI</label>
              <input type="text" class="form-control" id="dniInput" placeholder="DNI del censo">
            </div>
            <div class="mb-3">
              <label for="passInput" class="form-label">Contraseña</label>
              <input type="contrasena" class="form-control" id="passInput" placeholder="Contraseña de Voto3">
            </div>
            <div class="form-check mb-3">
              <input class="form-check-input" type="checkbox" id="rememberCheckbox">
              <label class="form-check-label" for="rememberCheckbox">Guardar credenciales</label>
            </div>
            <div id="errorCenso" class="text-danger" style="display:none;"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="cancelCenso">Cancelar</button>
            <button type="button" class="btn btn-primary" id="acceptCenso">Aceptar</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal, { backdrop: 'static', keyboard: false });
    bsModal.show();

    const dniInput = modal.querySelector('#dniInput');
    const passInput = modal.querySelector('#passInput');
    const rememberCheckbox = modal.querySelector('#rememberCheckbox');
    const errorDiv = modal.querySelector('#errorCenso');
    const btnAccept = modal.querySelector('#acceptCenso');
    const btnCancel = modal.querySelector('#cancelCenso');

    if (credenciales) {
      dniInput.value = credenciales.dni;
      passInput.value = credenciales.contrasena;
      rememberCheckbox.checked = true;
    }

    btnAccept.addEventListener('click', async () => {
      const dni = dniInput.value.trim();
      const contrasena = passInput.value;
      if (!dni || !contrasena) {
        errorDiv.textContent = 'DNI y contraseña son obligatorios.';
        errorDiv.style.display = 'block';
        return;
      }
      try {
        // const datosCenso = await servicioVotante.recuperarDatosCensales(dni, contrasena);
        // if (rememberCheckbox.checked) {
        //   await idb.actualizarVotante({ dni, contrasena, encrypted: true, payload: datosCenso });
        // } else if (votante) {
        //   await idb.eliminarVotante(votante.dni);
        // }
        if (rememberCheckbox.checked) {
          const credenciales = await encriptar({ dni, contrasena }, servicioLogin.getClaveDerivada());
          console.log('Guardando credenciales en IDB:', nombreUsuario, credenciales);
          await idb.actualizarVotante({ nombreUsuario, credenciales });
        }
        bsModal.hide(); modal.remove();
        resolve({ dni, contrasena, recordar: rememberCheckbox.checked });
      } catch (err) {
        errorDiv.textContent = err.message || 'Error al recuperar datos.';
        errorDiv.style.display = 'block';
      }
    });

    btnCancel.addEventListener('click', () => {
      bsModal.hide(); modal.remove();
      resolve(null);
    });
  });
}

/**
 * Envuelve una llamada al servidor Voto3 para notificar acceso primero.
 * @param {Function} peticion - async function({dni,contrasena}, ...args)
 * @returns {Function} async wrapper(...args)
 */
export function wrapAccesoIdentificado(titulo, peticion) {
  return async function(...args) {
    const credenciales = await notificarAccesoIdentificado(titulo);
    // if (!credenciales) throw new Error('Operación cancelada por el usuario');
    return peticion(credenciales, ...args);
  }
}
