import { BaseDAO } from './BaseDAO.js';

export class ResultadoEleccionDAO extends BaseDAO {
  constructor() {
    super('ResultadoEleccion');
  }

  async crearResultado(db, eleccionId, datos) {
    return await this.crear(db, {
      eleccionId,
      censados: datos.censados || 0,
      votantes: datos.votantes || 0,
      abstenciones: datos.abstenciones || 0,
      votosBlancos: datos.votosBlancos || 0,
      votosNulos: datos.votosNulos || 0,
      fechaRecuento: new Date().toISOString()
    });
  }

  async obtenerResultadoCompleto(db, eleccionId) {
    const resultado = await this.obtenerPorId(db, eleccionId, 'eleccionId');
    if (!resultado) return null;

    const partidosResultados = await db.all(
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

  async actualizarEstadisticas(db, eleccionId, datos) {
    return await this.actualizar(db, eleccionId, datos, 'eleccionId');
  }
}