// muestra estadísticas globales y por partido
import { limpiarManejadores } from '../utiles/utilesVistas.js';

export function componenteResultados(
  contenedor,
  resultados,   // { totalVotos, porPartido: [{id,nombre,votos},…] }
  partidos,
  usuario
) {
  // No hay listeners aquí, sólo pintado
  const barras = resultados.porPartido.map(p=>`
    <li>${p.nombre}: ${p.votos} votos</li>
  `).join('');
  contenedor.innerHTML = `
    <p><strong>Total votos:</strong> ${resultados.totalVotos}</p>
    <ul class="list-unstyled">${barras}</ul>
    <button id="btnVerificar" class="btn btn-outline-info">Verificar mi voto</button>
  `;
  // podrías añadir listener a btnVerificar para mostrar confirmación…
  return () => {};
}
