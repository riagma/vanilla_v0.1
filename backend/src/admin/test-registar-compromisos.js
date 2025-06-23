#!/usr/bin/env node
import { registrarVotanteEleccion } from '../algorand/registrarCompromiso.js';
import { abrirConexionBD, cerrarConexionBD } from '../bd/BD.js';
import { eleccionDAO, contratoBlockchainDAO, votanteDAO } from '../bd/DAOs.js';
import { randomSha256 } from '../utiles/utilesCrypto.js';


const eleccionId = process.argv[2];
const numeroVotantes = process.argv[3] || 100;

if (!eleccionId) {
    console.error(`Uso: node ${process.argv[1]} <elección-id> <número-votantes>?`);
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

    const votantesSinRegistro = votanteDAO.obtenerVotantesSinRegistro(bd, parseInt(eleccionId), parseInt(numeroVotantes));

    if (votantesSinRegistro.length > 0) {

        console.log(`Se registrarán ${votantesSinRegistro.length} votantes en la elección ${eleccionId}.`);

        console.log = function () {}; // Desactiva console.log para evitar demasiada salida

        for (const votante of votantesSinRegistro) {

            const votanteId = votante.dni;
            const compromiso = randomSha256();

            await registrarVotanteEleccion(bd, { eleccionId, contratoId, votanteId, compromiso });

            console.log(`Compromiso registrado para el votante ${votante.dni} en la elección ${eleccionId}: ${compromiso}`);
        }
    }
 
} catch (err) {
    console.error('Error abriendo el registro de compromisos:', err);
    process.exit(1);

} finally {
    cerrarConexionBD();
}

