import { BaseDAO } from './BaseDAO.js';

export class ResultadoEleccionDAO extends BaseDAO {
  constructor() {
    super('ResultadoEleccion');
  }

  // Crear resultado (puedes usar this.crear directamente si los campos coinciden)
  async crearResultado(bd, datos) {
    return await this.crear(bd, {
      ...datos,
      fechaRecuento: datos.fechaRecuento || new Date().toISOString()
    });
  }

  // Obtener resultado por eleccionId (clave alternativa)
  async obtenerPorEleccionId(bd, eleccionId) {
    return await this.obtenerPorId(bd, { eleccionId });
  }

  // Actualizar por eleccionId (clave alternativa)
  async actualizarPorEleccionId(bd, eleccionId, datos) {
    return await this.actualizar(bd, { eleccionId }, datos);
  }

  // Eliminar por eleccionId (clave alternativa)
  async eliminarPorEleccionId(bd, eleccionId) {
    return await this.eliminar(bd, { eleccionId });
  }

  // Obtener resultado completo con partidos
  async obtenerResultadoCompleto(bd, eleccionId) {
    const resultado = await this.obtenerPorId(bd, { eleccionId });
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
}