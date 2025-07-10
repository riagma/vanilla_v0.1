// muestra o gestiona el registro del votante
import { servicioEleccion } from '../servicios/servicioEleccion.js';
import { limpiarManejadores } from '../utiles/utilesVistas.js';

export function componenteRegistroUsuario(
  contenedor,
  idEleccion,
  registroUsuario,
  periodoAbierto,
  usuario
) {
  let manejadores = new Set();

  function render() {
    limpiarManejadores(manejadores);
    if (!periodoAbierto) {
      contenedor.innerHTML = `<div class="alert alert-secondary">El periodo de registro ya ha cerrado.</div>`;
      return;
    }
    if (registroUsuario) {
      contenedor.innerHTML = `
        <ul class="list-unstyled">
          <li><strong>Cuenta:</strong> ${registroUsuario.cuentaAlgorand}</li>
          <li><strong>Compromiso:</strong> ${registroUsuario.compromiso}</li>
          <li><strong>Índice:</strong> ${registroUsuario.indice}</li>
          <li><strong>Tx:</strong> ${registroUsuario.txId}</li>
        </ul>`;
    } else {
      contenedor.innerHTML = `<button id="btnRegistrar" class="btn btn-outline-primary">Registrarse</button>`;
      const btn = contenedor.querySelector('#btnRegistrar');
      const handler = async () => {
        await servicioEleccion.registrarUsuario(idEleccion, usuario);
        registroUsuario = await servicioEleccion.obtenerRegistroUsuario(idEleccion, usuario);
        render();
      };
      btn.addEventListener('click', handler);
      manejadores.add([btn,'click',handler]);
    }
  }

  render();
  return () => limpiarManejadores(manejadores);
}
