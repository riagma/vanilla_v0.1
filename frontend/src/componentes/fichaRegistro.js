// muestra o gestiona el registro del votante
import { servicioEleccion } from '../servicios/servicioEleccion.js';
import { limpiarManejadores } from '../utiles/utilesVistas.js';

export function fichaRegistro(
  contenedor,
  idEleccion,
  registroUsuario,
  periodoAbierto,
  usuario
) {
  let manejadores = new Set();

  function render() {
    limpiarManejadores(manejadores);
    let html = '';

    if (!periodoAbierto) {
      html += `<div class="alert alert-secondary">El periodo de registro ya se ha cerrado.</div>`;
      // return;
    }
    if (registroUsuario) {
      html += `
        <ul class="list-unstyled">
          <li><strong>Cuenta:</strong> ${registroUsuario.cuentaAlgorand}</li>
          <li><strong>Compromiso:</strong> ${registroUsuario.compromiso}</li>
          <li><strong>Índice:</strong> ${registroUsuario.indice}</li>
          <li><strong>Tx:</strong> ${registroUsuario.txId}</li>
        </ul>`;
    } else if (periodoAbierto) {
      html += `<button id="btnRegistrar" class="btn btn-outline-primary">Registrarse</button>`;
    } else {
      html += `<div class="alert alert-secondary">No se registró para esta elección.</div>`;
    }

    contenedor.innerHTML = html;

    if (!registroUsuario && periodoAbierto) {
      const btn = contenedor.querySelector('#btnRegistrar');
      const handler = async () => {
        await servicioEleccion.registrarUsuario(idEleccion, usuario);
        registroUsuario = await servicioEleccion.obtenerRegistroUsuario(idEleccion, usuario);
        render();
      };
      btn.addEventListener('click', handler);
      manejadores.add([btn, 'click', handler]);
    }
  }

  render();
  return () => limpiarManejadores(manejadores);
}
