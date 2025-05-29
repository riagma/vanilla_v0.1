export class BaseDAO {
  constructor(nombreTabla) {
    this.nombreTabla = nombreTabla;
  }

  async obtenerTodos(bd) {
    return await bd.all(`SELECT * FROM ${this.nombreTabla}`);
  }

  async obtenerPorId(bd, id, campoId = 'id') {
    return await bd.get(
      `SELECT * FROM ${this.nombreTabla} WHERE ${campoId} = ?`, 
      [id]
    );
  }

  async crear(bd, datos) {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    const marcadores = campos.map(() => '?').join(',');
    
    const resultado = await bd.run(
      `INSERT INTO ${this.nombreTabla} (${campos.join(',')}) 
       VALUES (${marcadores})`,
      valores
    );
    
    return resultado.lastID;
  }

  async actualizar(bd, id, datos, campoId = 'id') {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    const actualizaciones = campos.map(campo => `${campo} = ?`).join(',');
    
    const resultado = await bd.run(
      `UPDATE ${this.nombreTabla} 
       SET ${actualizaciones} 
       WHERE ${campoId} = ?`,
      [...valores, id]
    );
    
    return resultado.changes;
  }

  async eliminar(bd, id, campoId = 'id') {
    const resultado = await bd.run(
      `DELETE FROM ${this.nombreTabla} WHERE ${campoId} = ?`,
      [id]
    );
    return resultado.changes;
  }
}