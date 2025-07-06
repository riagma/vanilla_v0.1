import { parentPort } from 'worker_threads';
import Database from 'better-sqlite3';
import { ConexionBD } from '../modelo/BD.js';
import { AdministradorDAO } from '../modelo/daos/AdministradorDAO.js';
import { VotanteDAO } from '../modelo/daos/VotanteDAO.js';
import { EleccionDAO } from '../modelo/daos/EleccionDAO.js';
import { PartidoDAO } from '../modelo/daos/PartidoDAO.js';
import { PartidoEleccionDAO } from '../modelo/daos/PartidoEleccionDAO.js';
import { RegistroVotanteEleccionDAO } from '../modelo/daos/RegistroVotanteEleccionDAO.js';
import { ResultadoEleccionDAO } from '../modelo/daos/ResultadoEleccionDAO.js';
import { ResultadoPartidoDAO } from '../modelo/daos/ResultadoPartidoDAO.js';
import { CuentaBlockchainDAO } from '../modelo/daos/CuentaBlockchainDAO.js';
import { ContratoBlockchainDAO } from '../modelo/daos/ContratoBlockchainDAO.js';

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