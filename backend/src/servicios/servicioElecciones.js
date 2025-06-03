import { daos } from '../bd/daos.js';

export const servicioElecciones = {

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

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------

  async obtenerTodas(bd) {
    return await daos.eleccion.obtenerTodos(bd);
  },

  //----------------------------------------------------------------------------

  async obtenerPorId(bd, id) {
    const eleccion = await daos.eleccion.obtenerPorId(bd, { id });
    if (!eleccion) throw new Error('Elección no encontrada');

    const partidos = await daos.partidoEleccion.obtenerPartidosPorEleccion(bd, id);
    
    return {
      ...eleccion,
      partidos
    };
  },

  //----------------------------------------------------------------------------

  async obtenerDetalle(bd, id, dni) {
    const eleccion = await daos.eleccion.obtenerPorId(bd, { id });
    if (!eleccion) throw new Error('Elección no encontrada');

    const partidos = await daos.partidoEleccion.obtenerPartidosPorEleccion(bd, id);
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
      registro: registroVotante || null,
      resultados: resultadosCompletos || null
    };
  },

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------

  async listarPorVotante(bd, dniVotante) {
    return await daos.registroVotanteEleccion.obtenerEleccionesPorVotante(bd, dniVotante);
  },

  async listarPartidosPorEleccion(bd, idEleccion) {
    // Devuelve los partidos asociados a una elección
    return await daos.partidoEleccion.obtenerPartidosPorEleccion(bd, idEleccion);
  },

  async obtenerResultadosEleccion(bd, idEleccion) {
    // Devuelve los resultados de la elección (puedes adaptar según tu modelo)
    return await daos.resultado.obtenerPorEleccion(bd, idEleccion);
  },

  async obtenerRegistroVotanteEnEleccion(bd, dniVotante, idEleccion) {
    // Devuelve el registro del votante en una elección concreta
    return await daos.registroVotanteEleccion.obtenerPorVotanteYEleccion(bd, dniVotante, idEleccion);
  },

  async registrarVotante(bd, dniVotante, idEleccion, compromiso) {
    // Registra al votante en la elección (puedes adaptar los campos según tu modelo)
    return await daos.registroVotanteEleccion.crear(bd, {
      dniVotante,
      idEleccion,
      compromiso
    });
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
    fechaCelebracion
  } = datosEleccion;

  const fechas = {
    fechaInicioRegistro: new Date(fechaInicioRegistro),
    fechaFinRegistro: new Date(fechaFinRegistro),
    fechaInicioVotacion: new Date(fechaInicioVotacion),
    fechaFinVotacion: new Date(fechaFinVotacion),
    fechaCelebracion: new Date(fechaCelebracion)
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
  if (fechas.fechaFinVotacion >= fechas.fechaCelebracion) {
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
    'fechaCelebracion'
  ];

  return camposFecha.some(campo => 
    nuevos[campo] && nuevos[campo] !== existentes[campo]
  );
}