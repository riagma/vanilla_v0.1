#!/usr/bin/env node
const contratoId = process.argv[2];
const eleccionId = process.argv[3];

if (!contratoId || !eleccionId) {
    console.error(`Uso: node ${process.argv[1]} <contrato-id> <elección-id>`);
    process.exit(1);
}

//-------------

import { cerrarConexionBD, abrirConexionBD } from '../bd/BD.js';
import { eleccionDAO, contratoBlockchainDAO } from '../bd/DAOs.js';
import { asociarContratoEleccion } from '../algorand/asociarContratoEleccion.js';

//-------------

try {
    const bd = abrirConexionBD();

    const eleccion = eleccionDAO.obtenerPorId(eleccionId);
    console.log(eleccion)

    const contrato = contratoBlockchainDAO.obtenerPorId(contratoId);
    console.log(contrato)

    // await asociarContratoEleccion(bd, contratoId, eleccionId);

} catch (err) {
    console.error('Error asociando contrato a elección:', err);
    process.exit(1);

} finally {
    cerrarConexionBD();
}

