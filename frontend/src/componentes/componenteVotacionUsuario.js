// muestra botón de votar o datos de su voto
import { servicioEleccion } from '../servicios/servicioEleccion.js';
import { limpiarManejadores } from '../utiles/utilesVistas.js';

export function componenteVotacionUsuario(
  contenedor,
  idEleccion,
  partidos,
  votoUsuario,
  dentroVotacion,
  esperandoEscrutinio,
  usuario
) {
  let manejadores = new Set();

  function render() {
    limpiarManejadores(manejadores);
    if (!votoUsuario && dentroVotacion) {
      // mostrar lista de partidos
      const lista = partidos.map(p=>`
        <button class="btn btn-sm btn-outline-secondary m-1 btn-votar" data-id="${p.id}">
          ${p.nombre}
        </button>
      `).join('');
      contenedor.innerHTML = `<div>${lista}</div>`;
      contenedor.querySelectorAll('.btn-votar').forEach(btn=>{
        const handler = async () => {
          const partidoId = btn.dataset.id;
          await servicioEleccion.votar(idEleccion, usuario, partidoId);
          votoUsuario = await servicioEleccion.obtenerVotoUsuario(idEleccion, usuario);
          render();
        };
        btn.addEventListener('click', handler);
        manejadores.add([btn,'click',handler]);
      });
    } else {
      // mostrar datos de su voto
      if (!votoUsuario) {
        contenedor.innerHTML = `<div class="alert alert-warning">
          No has votado y el plazo ha terminado.</div>`;
      } else {
        contenedor.innerHTML = `
          <ul class="list-unstyled">
            <li><strong>Tu voto:</strong> ${votoUsuario.partido}</li>
            <li><strong>Anulador:</strong> ${votoUsuario.anulador}</li>
            <li><strong>Tx:</strong> ${votoUsuario.txId}</li>
          </ul>`;
      }
    }
  }

  render();
  return () => limpiarManejadores(manejadores);
}
