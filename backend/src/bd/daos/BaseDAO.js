export class BaseDAO {
  constructor(nombreTabla) {
    this.nombreTabla = nombreTabla;
  }

  crearWhere(id) {
    if (typeof id === 'object' && id !== null) {
      const campos = Object.keys(id);
      if (campos.length === 0) {
        throw new Error('El objeto id debe tener al menos una clave');
      }
      const condiciones = campos.map(campo => `${campo} = ?`).join(' AND ');
      const valores = Object.values(id);
      return { condiciones, valores };
    } else {
      throw new Error('El parámetro id debe ser un objeto con los campos clave');
    }
  }

  async obtenerTodos(bd) {
    return await bd.all(`SELECT * FROM ${this.nombreTabla}`);
  }

  async obtenerPorId(bd, id) {
    console.log('Obteniendo registro por ID:', id);
    const { condiciones, valores } = this.crearWhere(id);
    console.log('Condiciones de búsqueda:', condiciones, 'Valores:', valores);
    return await bd.get(
      `SELECT * FROM ${this.nombreTabla} WHERE ${condiciones}`,
      valores
    );
  }

  async crear(bd, datos) {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    const marcadores = campos.map(() => '?').join(',');
    const resultado = await bd.run(
      `INSERT INTO ${this.nombreTabla} (${campos.join(',')}) VALUES (${marcadores})`,
      valores
    );
    return resultado.lastID;
  }

  async actualizar(bd, id, datos) {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    const actualizaciones = campos.map(campo => `${campo} = ?`).join(',');
    const { condiciones, valores: valoresId } = this.crearWhere(id);

    const resultado = await bd.run(
      `UPDATE ${this.nombreTabla} SET ${actualizaciones} WHERE ${condiciones}`,
      [...valores, ...valoresId]
    );
    return resultado.changes;
  }

  async eliminar(bd, id) {
    const { condiciones, valores } = this.crearWhere(id);
    const resultado = await bd.run(
      `DELETE FROM ${this.nombreTabla} WHERE ${condiciones}`,
      valores
    );
    return resultado.changes;
  }
}