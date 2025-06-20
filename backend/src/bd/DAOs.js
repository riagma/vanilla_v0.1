import { AdministradorDAO } from './daos/AdministradorDAO.js';
import { VotanteDAO } from './daos/VotanteDAO.js';
import { EleccionDAO } from './daos/EleccionDAO.js';
import { PartidoDAO } from './daos/PartidoDAO.js';
import { PartidoEleccionDAO } from './daos/PartidoEleccionDAO.js';
import { RegistroVotanteEleccionDAO } from './daos/RegistroVotanteEleccionDAO.js';
import { ResultadoEleccionDAO } from './daos/ResultadoEleccionDAO.js';
import { ResultadoPartidoDAO } from './daos/ResultadoPartidoDAO.js';
import { CuentaBlockchainDAO } from './daos/CuentaBlockchainDAO.js';
import { ContratoBlockchainDAO } from './daos/ContratoBlockchainDAO.js';

// Creación de instancias singleton
const administradorDAO = new AdministradorDAO();
const votanteDAO = new VotanteDAO();
const eleccionDAO = new EleccionDAO();
const partidoDAO = new PartidoDAO();
const partidoEleccionDAO = new PartidoEleccionDAO();
const registroVotanteEleccionDAO = new RegistroVotanteEleccionDAO();
const resultadoEleccionDAO = new ResultadoEleccionDAO();
const resultadoPartidoDAO = new ResultadoPartidoDAO();
const cuentaBlockchainDAO = new CuentaBlockchainDAO();
const contratoBlockchainDAO = new ContratoBlockchainDAO();

// Objeto inmutable con todos los DAOs
export const daos = Object.freeze({
  administrador: administradorDAO,
  votante: votanteDAO,
  eleccion: eleccionDAO,
  partido: partidoDAO,
  partidoEleccion: partidoEleccionDAO,
  registroVotanteEleccion: registroVotanteEleccionDAO,
  resultadoEleccion: resultadoEleccionDAO,
  resultadoPartido: resultadoPartidoDAO,
  cuentaBlockchain: cuentaBlockchainDAO,
  contratoBlockchain: contratoBlockchainDAO,
});

// Exportación individual de DAOs
export {
  administradorDAO,
  votanteDAO,
  eleccionDAO,
  partidoDAO,
  partidoEleccionDAO,
  registroVotanteEleccionDAO,
  resultadoEleccionDAO,
  resultadoPartidoDAO,
  cuentaBlockchainDAO,
  contratoBlockchainDAO,
};