export class BaseDAO {
  constructor(nombreTabla) {
    this.nombreTabla = nombreTabla;
  }

  async obtenerTodos(db) {
    return await db.all(`SELECT * FROM ${this.nombreTabla}`);
  }

  async obtenerPorId(db, id, campoId = 'id') {
    return await db.get(
      `SELECT * FROM ${this.nombreTabla} WHERE ${campoId} = ?`, 
      [id]
    );
  }

  async crear(db, datos) {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    const marcadores = campos.map(() => '?').join(',');
    
    const resultado = await db.run(
      `INSERT INTO ${this.nombreTabla} (${campos.join(',')}) 
       VALUES (${marcadores})`,
      valores
    );
    
    return resultado.lastID;
  }

  async actualizar(db, id, datos, campoId = 'id') {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    const actualizaciones = campos.map(campo => `${campo} = ?`).join(',');
    
    const resultado = await db.run(
      `UPDATE ${this.nombreTabla} 
       SET ${actualizaciones} 
       WHERE ${campoId} = ?`,
      [...valores, id]
    );
    
    return resultado.changes;
  }

  async eliminar(db, id, campoId = 'id') {
    const resultado = await db.run(
      `DELETE FROM ${this.nombreTabla} WHERE ${campoId} = ?`,
      [id]
    );
    return resultado.changes;
  }
}