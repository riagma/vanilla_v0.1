#!/usr/bin/env node
import { cerrarConexionBD, abrirConexionBD } from '../bd/BD.js';
import { desplegarContrato } from '../algorand/desplegarContrato.js';

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

