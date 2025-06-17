#!/usr/bin/env node
import { crearCuentaEleccion } from '../algorand/crearCuentaEleccion.js';

const nombreEleccion = process.argv[2];
if (!nombreEleccion) {
    console.error('Uso: node crear-cuenta-eleccion.js <nombre-elección>');
    process.exit(1);
}

try {
    const { direccion, mnemotecnico } = await crearCuentaEleccion(nombreEleccion);
    if (direccion !== undefined)    console.log('  direccion    : ', direccion);
    if (mnemotecnico !== undefined) console.log('  mnemotecnico : ', mnemotecnico);
} catch (err) {
    console.error('Error en la creación:', err);
    process.exit(1);
}
