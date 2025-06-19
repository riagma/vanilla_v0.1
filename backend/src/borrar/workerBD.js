import { parentPort } from 'worker_threads';
import Database from 'better-sqlite3';
import { ConexionBD } from '../bd/BD.js';
import { AdministradorDAO } from '../bd/daos/AdministradorDAO.js';
import { VotanteDAO } from '../bd/daos/VotanteDAO.js';
import { EleccionDAO } from '../bd/daos/EleccionDAO.js';
import { PartidoDAO } from '../bd/daos/PartidoDAO.js';
import { PartidoEleccionDAO } from '../bd/daos/PartidoEleccionDAO.js';
import { RegistroVotanteEleccionDAO } from '../bd/daos/RegistroVotanteEleccionDAO.js';
import { ResultadoEleccionDAO } from '../bd/daos/ResultadoEleccionDAO.js';
import { ResultadoPartidoDAO } from '../bd/daos/ResultadoPartidoDAO.js';
import { CuentaBlockchainDAO } from '../bd/daos/CuentaBlockchainDAO.js';
import { ContratoBlockchainDAO } from '../bd/daos/ContratoBlockchainDAO.js';

const db = new ConexionBD().db;

const daos = {
  administrador: new AdministradorDAO(),
  votante: new VotanteDAO(),
  eleccion: new EleccionDAO(),
  partido: new PartidoDAO(),
  partidoEleccion: new PartidoEleccionDAO(),
  registroVotanteEleccion: new RegistroVotanteEleccionDAO(),
  resultadoEleccion: new ResultadoEleccionDAO(),
  resultadoPartido: new ResultadoPartidoDAO(),
  cuentaBlockchain: new CuentaBlockchainDAO(),
  contratoBlockchain: new ContratoBlockchainDAO(),
};

parentPort.on('message', async ({ action, tabla, args, id }) => {
  try {
    const dao = daos[tabla];
    if (!dao || typeof dao[action] !== 'function') {
      throw new Error(`Método ${action} no soportado en DAO ${tabla}`);
    }
    const resultado = await dao[action](...args);
    parentPort.postMessage({ ok: true, resultado, id });
  } catch (error) {
    parentPort.postMessage({ ok: false, error: error.message, id });
  }
});