#!/usr/bin/env node
import { registrarRaicesEleccion } from '../algorand/registrarRaices.js';
import { abrirConexionBD, cerrarConexionBD } from '../bd/BD.js';
import { eleccionDAO, contratoBlockchainDAO, votanteDAO } from '../bd/DAOs.js';


const eleccionId = process.argv[2];

if (!eleccionId) {
    console.error(`Uso: node ${process.argv[1]} <elección-id>`);
    process.exit(1);
}

try {
    const bd = abrirConexionBD();

    const eleccion = eleccionDAO.obtenerPorId(bd, { id: eleccionId });

    if (!eleccion) {
        console.error(`No se encontró la elección con ID ${eleccionId}`);
        process.exit(1);
    }

    const contratoId = eleccion.contratoId;

    const contrato = contratoBlockchainDAO.obtenerPorId(bd, { contratoId });

    if (!contrato) {
        console.error(`No se encontró el contrato con ID ${contratoId}`);
        process.exit(1);
    }

    const resultadoRegistrar = registrarRaicesEleccion(bd, { eleccionId });

 
} catch (err) {
    console.error('Error abriendo el registro de compromisos:', err);
    process.exit(1);

} finally {
    cerrarConexionBD();
}

