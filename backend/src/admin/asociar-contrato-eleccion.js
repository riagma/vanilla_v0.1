#!/usr/bin/env node
import { createInterface } from 'readline';
import { cerrarConexionBD, abrirConexionBD } from '../bd/BD.js';
import { eleccionDAO, contratoBlockchainDAO } from '../bd/DAOs.js';
import { asociarContratoEleccion } from '../algorand/asociarContratoEleccion.js';

const contratoId = process.argv[2];
const eleccionId = process.argv[3];

if (!contratoId || !eleccionId) {
    console.error(`Uso: node ${process.argv[1]} <contrato-id> <elección-id>`);
    process.exit(1);
}

//-------------

try {
    const bd = abrirConexionBD();

    const eleccion = eleccionDAO.obtenerPorId(bd, { id: eleccionId });
    if (!eleccion) {
        console.error(`No se encontró la elección con ID ${eleccionId}`);
        process.exit(1);
    }

    const contrato = contratoBlockchainDAO.obtenerPorId(bd, { contratoId });
    if (!contrato) {
        console.error(`No se encontró el contrato con ID ${contratoId}`);
        process.exit(1);
    }

    if (eleccion.contratoId && eleccion.contratoId === contratoId) {
        console.log(`El contrato con ID ${contratoId} ya está asociado a la elección con ID ${eleccionId}`);
        process.exit(0);

    } else if (eleccion.contratoId) {
        const reemplazarlo = await preguntarUsuario(
            `La elección con ID ${eleccionId} ya tiene asociado el contrato con ID ${eleccion.contratoId}.\n` +
            '¿Deseas reemplazarlo? (s/n): '
        );
        if (!reemplazarlo) {
            console.log('Operación cancelada.');
            process.exit(0);
        }
    }

    console.log(`Reemplazando el contrato con ID ${eleccion.contratoId} por el contrato con ID ${contratoId}`);
    asociarContratoEleccion(bd, contratoId, eleccionId);
    console.log(`Contrato con ID ${contratoId} asociado a la elección con ID ${eleccionId}`);

} catch (err) {
    console.error('Error asociando contrato a elección:', err);
    process.exit(1);

} finally {
    cerrarConexionBD();
}

//-------------

async function preguntarUsuario(pregunta) {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolver => {
        rl.question(pregunta, (respuesta) => {
            rl.close();
            resolver(respuesta.toLowerCase().startsWith('s'));
        });
    });
}



