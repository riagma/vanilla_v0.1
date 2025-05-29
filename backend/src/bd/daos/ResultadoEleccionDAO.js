import { BaseDAO } from './BaseDAO.js';

export class ResultadoEleccionDAO extends BaseDAO {
  constructor() {
    super('ResultadoEleccion');
  }

  async crearResultado(bd, eleccionId, datos) {
    return await this.crear(bd, {
      eleccionId,
      censados: datos.censados || 0,
      votantes: datos.votantes || 0,
      abstenciones: datos.abstenciones || 0,
      votosBlancos: datos.votosBlancos || 0,
      votosNulos: datos.votosNulos || 0,
      fechaRecuento: new Date().toISOString()
    });
  }

  async obtenerResultadoCompleto(bd, eleccionId) {
    const resultado = await this.obtenerPorId(bd, eleccionId, 'eleccionId');
    if (!resultado) return null;

    const partidosResultados = await bd.all(
      `SELECT p.nombre, p.siglas, rp.votos, rp.porcentaje
       FROM ResultadoPartido rp
       INNER JOIN Partido p ON rp.partidoId = p.siglas
       WHERE rp.eleccionId = ?`,
      [eleccionId]
    );

    return {
      ...resultado,
      partidos: partidosResultados
    };
  }

  async actualizarEstadisticas(bd, eleccionId, datos) {
    return await this.actualizar(bd, eleccionId, datos, 'eleccionId');
  }
}