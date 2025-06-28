#!/usr/bin/env node
import { execSync } from 'child_process';
import { abrirConexionBD, cerrarConexionBD } from '../bd/BD.js';
import { cuentaBlockchainDAO } from '../bd/DAOs.js';
import { encriptar, desencriptar } from '../utiles/utilesCrypto.js';
import { CLAVE_MAESTRA } from '../utiles/constantes.js';

function run(cmd) {
  try {
    const output = execSync(cmd, { encoding: 'utf8' });
    console.log(`\n$ ${cmd}\n${output}`);
    return output;
  } catch (err) {
    console.error(`Error ejecutando: ${cmd}\n`, err.stderr?.toString() || err.message);
    process.exit(1);
  }
}

try {
  const bd = abrirConexionBD();

  const texto = "prueba secreta";
  const cifrado = await encriptar(texto, CLAVE_MAESTRA);
  const descifrado = await desencriptar(cifrado, CLAVE_MAESTRA);
  console.log(descifrado); // debe ser "prueba secreta"

  run('algokit goal wallet -f unencrypted-default-wallet');
  const cuentas = run('algokit goal account list');

  const cuentaRegex = /\[online\]\s+([A-Z0-9]{58})/g;
  const cuentaMatch = cuentaRegex.exec(cuentas);

  if (cuentaMatch) {
    const direccion = cuentaMatch[1];
    console.log(`Cuenta encontrada: ${direccion}`);

    const datosCuenta = run(`algokit goal account export -a ${direccion}`);
    const mnemoMatch = datosCuenta.match(/"([^"]+)"/);

    if (mnemoMatch) {
      const mnemonico = mnemoMatch[1];
      const mnemonicoEncriptado = await encriptar(mnemonico, CLAVE_MAESTRA);
      console.log(`Mnemonico encriptado: ${mnemonicoEncriptado}`);

      const registroCuenta = cuentaBlockchainDAO.obtenerPorAddr(bd,
        {
          accNet: 'localnet',
          accAddr: direccion
        });

      let cuentaId = 0; 

      if (!registroCuenta) {

        const resultadoCrear = cuentaBlockchainDAO.crear(bd, {
          accNet: 'localnet',
          accAddr: direccion,
          accSecret: mnemonicoEncriptado,
        });

        cuentaId = resultadoCrear.lastInsertRowid;

        console.log(`Cuenta de prueba creada con ID: ${resultadoCrear.cuentaId}`);

      } else {

        cuentaId = registroCuenta.cuentaId;

        cuentaBlockchainDAO.actualizar(bd, { cuentaId }, { accSecret: mnemonicoEncriptado});

        console.log(`Mnemonico actualizado de cuenta: ${registroCuenta.cuentaId}`);
      }

      const registroMnemonico = await cuentaBlockchainDAO.obtenerMnemonico(bd, { cuentaId });
      console.log(`Mnemonico desencriptado: ${registroMnemonico}`);

      const registroPorId = await cuentaBlockchainDAO.obtenerPorId(bd, { cuentaId: registroCuenta.cuentaId });
      const mnemonicoDesencriptado = await desencriptar(registroPorId.accSecret, CLAVE_MAESTRA);
      console.log(`Mnemonico desencriptado: ${mnemonicoDesencriptado}`);
    }
  }

} catch (err) {
  console.error('Error creando cuenta de pruebas:', err);
  process.exit(1);

} finally {
  cerrarConexionBD();
}

