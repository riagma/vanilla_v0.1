#!/usr/bin/env node
import algosdk from 'algosdk';
import { registrarVotanteEleccion } from '../algorand/registrarCompromiso.js';
import { abrirConexionBD, cerrarConexionBD } from '../bd/BD.js';
import { eleccionDAO, contratoBlockchainDAO, votanteDAO } from '../bd/DAOs.js';
import { randomSha256, calcularPoseidonHash, encriptarJSON, desencriptarJSON } from '../utiles/utilesCrypto.js';

const CLAVE_PRUEBAS = 'mi super clave de pruebas';

const eleccionId = process.argv[2] ? parseInt(process.argv[2]) : undefined;
const numeroVotantes = process.argv[3] ? parseInt(process.argv[3]) : 100;

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

    const contrato = contratoBlockchainDAO.obtenerPorId(bd, { contratoId: eleccionId });

    if (!contrato) {
        console.error(`No se encontró el contrato para la elección con ID ${eleccionId}`);
        process.exit(1);
    }

    const votantesSinRegistro = votanteDAO.obtenerVotantesSinRegistro(bd, eleccionId, numeroVotantes);

    if (votantesSinRegistro.length > 0) {

        console.log(`Se registrarán ${votantesSinRegistro.length} votantes en la elección ${eleccionId}.`);

        console.log = function () {}; // Desactiva console.log para evitar demasiada salida

        for (const votante of votantesSinRegistro) {

            const votanteId = votante.dni;

            const { compromiso, datosPrivados } = await generarDatosPrivadoPruebas();

            await registrarVotanteEleccion(bd, { votanteId, eleccionId, compromiso, datosPrivados });

            console.log(`Compromiso registrado para el votante ${votante.dni} en la elección ${eleccionId}: ${compromiso}`);
        }
    }
 
} catch (err) {
    console.error('Error abriendo el registro de compromisos:', err);
    process.exit(1);

} finally {
    cerrarConexionBD();
}

async function generarDatosPrivadoPruebas() {

  const cuenta = algosdk.generateAccount();

  const datosPublicos = {
    cuentaAddr: cuenta.addr.toString(),
    cuentaMnemonic: algosdk.secretKeyToMnemonic(cuenta.sk),
    secreto: randomSha256(),
    anulador: randomSha256(),
  };

  // console.log('Datos públicos generados:', datosPublicos);

  const compromiso = calcularPoseidonHash(datosPublicos.secreto+datosPublicos.anulador);

  // console.log('Compromiso calculado:', compromiso);

  const datosPrivados = await encriptarJSON(datosPublicos, CLAVE_PRUEBAS);

  // console.log('Datos privados encriptados:', datosPrivados);
  // console.log('Datos privados desencriptados:', await desencriptarJSON(datosPrivados, CLAVE_PRUEBAS));

  return { compromiso, datosPrivados };
}


