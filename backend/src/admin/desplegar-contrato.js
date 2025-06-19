#!/usr/bin/env node
import { desplegarContrato } from '../algorand/desplegarContrato.js';
import { abrirConexionBD, cerrarConexionBD } from '../bd/BD.js';

const cuentaId = process.argv[2] || 0;

try {
    const bd = abrirConexionBD();

    await desplegarContrato(bd, cuentaId);

} catch (err) {
    console.error('Error en el despliegue:', err);
    process.exit(1);

} finally {
    cerrarConexionBD();
}

