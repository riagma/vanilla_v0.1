import { daos, eleccionDAO } from '../bd/DAOs.js';

export const serviciosElecciones = {

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------

  async obtenerTodas(bd) {
    const campos = [
      'id', 
      'nombre',
      'descripcion',
      'fechaInicioRegistro',
      'fechaFinRegistro',
      'fechaInicioVotacion', 
      'fechaFinVotacion',
      'fechaEscrutinio',
    ];
    return await eleccionDAO.obtenerTodos(bd, campos);
  },

  //----------------------------------------------------------------------------

  async obtenerPorId(bd, id) {
    const eleccion = await daos.eleccion.obtenerPorId(bd, { id });
    if (!eleccion) return null;

    const partidos = await daos.partidoEleccion.obtenerPartidosEleccion(bd, id);

    return {
      ...eleccion,
      partidos
    };
  },

  //----------------------------------------------------------------------------

  async obtenerDetalle(bd, id, dni) {
    const eleccion = await daos.eleccion.obtenerPorId(bd, { id });
    if (!eleccion) throw new Error('Elección no encontrada');

    const partidos = await daos.partidoEleccion.obtenerPartidosEleccion(bd, id);
    const registroVotante = await daos.registroVotanteEleccion.obtenerPorId(bd, dni, id);
    const resultadosEleccion = await daos.resultadoEleccion.obtenerPorEleccionId(bd, id);
    const resultadosPorPartido = await daos.resultadoPartido.obtenerPorEleccion(bd, id);

    // // Asocia resultados a partidos
    // const partidosConResultados = partidos.map(partido => ({
    //   ...partido,
    //   resultado: resultadosPorPartido.find(rp => rp.partidoId === partido.siglas) || null
    // }));

    const resultadosCompletos = resultadosEleccion ? {
      ...resultadosEleccion,
      porPartido: resultadosPorPartido || []
    } : null;

    return {
      eleccion,
      partidos,
      resultados: resultadosCompletos || null,
      registro: registroVotante || null,
    };
  },

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------

  async crear(bd, datosEleccion) {
    // Validar fechas
    const fechas = validarFechasEleccion(datosEleccion);

    // Crear elección con estado inicial
    const eleccionACrear = {
      ...datosEleccion,
      ...fechas,
      estado: 'PENDIENTE'
    };

    return await daos.eleccion.crear(bd, eleccionACrear);
  },

  async actualizar(bd, id, datosEleccion) {
    const eleccionExistente = await daos.eleccion.obtenerPorId(bd, id);
    if (!eleccionExistente) {
      throw new Error('Elección no encontrada');
    }

    // Validar fechas si se actualizan
    if (algunaFechaCambia(datosEleccion, eleccionExistente)) {
      validarFechasEleccion(datosEleccion);
    }

    return await daos.eleccion.actualizar(bd, id, datosEleccion);
  },

  async eliminar(bd, id) {
    const eleccionExistente = await daos.eleccion.obtenerPorId(bd, id);
    if (!eleccionExistente) {
      throw new Error('Elección no encontrada');
    }

    if (eleccionExistente.estado !== 'PENDIENTE') {
      throw new Error('Solo se pueden eliminar elecciones pendientes');
    }

    return await daos.eleccion.eliminar(bd, id);
  },
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// Funciones auxiliares
function validarFechasEleccion(datosEleccion) {
  const {
    fechaInicioRegistro,
    fechaFinRegistro,
    fechaInicioVotacion,
    fechaFinVotacion,
    fechaEscrutinio
  } = datosEleccion;

  const fechas = {
    fechaInicioRegistro: new Date(fechaInicioRegistro),
    fechaFinRegistro: new Date(fechaFinRegistro),
    fechaInicioVotacion: new Date(fechaInicioVotacion),
    fechaFinVotacion: new Date(fechaFinVotacion),
    fechaEscrutinio: new Date(fechaEscrutinio)
  };

  // Validar orden cronológico
  if (fechas.fechaInicioRegistro >= fechas.fechaFinRegistro) {
    throw new Error('La fecha de inicio de registro debe ser anterior a la de fin');
  }
  if (fechas.fechaFinRegistro >= fechas.fechaInicioVotacion) {
    throw new Error('La fecha de fin de registro debe ser anterior al inicio de votación');
  }
  if (fechas.fechaInicioVotacion >= fechas.fechaFinVotacion) {
    throw new Error('La fecha de inicio de votación debe ser anterior a la de fin');
  }
  if (fechas.fechaFinVotacion >= fechas.fechaEscrutinio) {
    throw new Error('La fecha de fin de votación debe ser anterior a la celebración');
  }

  return fechas;
}

function algunaFechaCambia(nuevos, existentes) {
  const camposFecha = [
    'fechaInicioRegistro',
    'fechaFinRegistro',
    'fechaInicioVotacion',
    'fechaFinVotacion',
    'fechaEscrutinio'
  ];

  return camposFecha.some(campo =>
    nuevos[campo] && nuevos[campo] !== existentes[campo]
  );
}