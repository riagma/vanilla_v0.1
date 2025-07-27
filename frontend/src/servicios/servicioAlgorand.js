import algosdk from 'algosdk';
import { api } from './api.js';


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

let algod = null;
let indexer = null;
let explorer = null;
let explorerAccount = null;
let explorerAsset = null;
let explorerApplication = null;
let explorerTransaction = null;

export async function configurarAlgorand() {
  if (!algod || !indexer || !explorer) {
    const config = await api.get(`/api/algorand/config`);

    if (
      !config ||
      !config.algodToken ||
      !config.algodServer ||
      !config.algodPort ||
      !config.indexerToken ||
      !config.indexerServer ||
      !config.indexerPort ||
      !config.explorerServer ||
      !config.explorerAccount ||
      !config.explorerAsset ||
      !config.explorerApplication ||
      !config.explorerTransaction) {
      throw new Error("Configuración de Algorand incompleta o inválida.");
    }

    try {
      configurarAlgorandClient(
        config.algodToken,
        config.algodServer,
        config.algodPort);

      configurarAlgorandIndexer(
        config.indexerToken,
        config.indexerServer,
        config.indexerPort);

      configurarExplorador(
        config.explorerServer,
        config.explorerAccount,
        config.explorerAsset,
        config.explorerApplication,
        config.explorerTransaction);

    } catch (error) {
      throw new Error("Error al configurar Algorand: " + error.message);
    }

    console.log("Algorand configurado correctamente.");
  }
  console.log("Algorand ya estaba configurado.");
}

export function configurarAlgorandClient(token, server, port) {
  algod = new algosdk.Algodv2(token, server, port);
  console.log("Configurado Algorand Client:", server, port);
}

export function configurarAlgorandIndexer(token, server, port) {
  indexer = new algosdk.Indexer(token, server, port);
  console.log("Configurado Algorand Indexer:", server, port);
}

export function configurarExplorador(server, account, asset, application, transaction) {
  explorer = server.endsWith('/') ? server : server + '/';
  explorerAccount = account.endsWith('/') ? account : account + '/';
  explorerAsset = asset.endsWith('/') ? asset : asset + '/';
  explorerApplication = application.endsWith('/') ? application : application + '/';
  explorerTransaction = transaction.endsWith('/') ? transaction : transaction + '/';

  console.log("Configurado explorador:",
    explorer,
    explorerAccount,
    explorerAsset,
    explorerApplication,
    explorerTransaction);
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

const codificador = new TextEncoder();
const decodificador = new TextDecoder();

export const servicioAlgorand = {

  crearCuentaAleatoria() {
    const cuenta = algosdk.generateAccount();
    // console.log("Cuenta creada:", cuenta.addr);
    // console.log("Mnemonic:", algosdk.secretKeyToMnemonic(cuenta.sk));
    return { cuentaAddr: cuenta.addr.toString(), mnemonico: algosdk.secretKeyToMnemonic(cuenta.sk) };
  },

  async revisarBalance(addr) {
    const cuentaInfo = await algod.accountInformation(addr).do();
    console.log(`Balance: ${cuentaInfo.amount} microALGOs`);
    return Number(cuentaInfo.amount);
  },

  async revisarOptIn(addr, assetId) {
    const cuentaInfo = await algod.accountInformation(addr).do();
    const assetIdBigInt = BigInt(assetId);
    const tiene = cuentaInfo.assets.find(a => a.assetId === assetIdBigInt);
    console.log(tiene ? "Ya está opt-in" : "No ha hecho opt-in");
    return !!tiene;
  },

  async revisarAssetId(addr, assetId) {
    const cuentaInfo = await algod.accountInformation(addr).do();
    const assetIdBigInt = BigInt(assetId);
    const asset = cuentaInfo.assets.find(a => a.assetId === assetIdBigInt);

    if (asset) {
      console.log(`La cuenta tiene ${asset.amount} del asset ${assetId}.`);
      return asset.amount;
    } else {
      console.log(`La cuenta no tiene el asset ${assetId}.`);
      return 0;
    }
  },

  async revisarCuenta(addr, assetId) {
    let balance = 0;
    let acepta = false;
    let papeleta = false;

    try {
      const cuentaInfo = await algod.accountInformation(addr).do();
      // Convertimos el assetId de entrada a BigInt para una comparación segura
      const assetIdBigInt = BigInt(assetId);

      balance = cuentaInfo.amount;

      // --- Logs para depuración ---
      const assetsEnCuenta = cuentaInfo.assets.map(a => a.assetId);
      console.log(`Buscando el asset ID: ${assetIdBigInt}`);
      console.log('Assets que la cuenta posee:', assetsEnCuenta);
      // --- FIN: Logs para depuración ---

      const assetEncontrado = cuentaInfo.assets.find(a => a.assetId === assetIdBigInt);

      if (assetEncontrado) {
        acepta = true; // Si se encuentra el asset, ha hecho opt-in
        papeleta = assetEncontrado.amount > 0; // Si la cantidad es > 0, tiene la papeleta
      }

    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn(`La cuenta ${addr} no se encontró en la red.`);
      } else {
        console.error(`Error al revisar la cuenta ${addr}:`, error);
      }
    }

    console.log(`Resultado para ${addr} con asset ${assetId}: Acepta(Opt-In)=${acepta}, Papeleta(Amount>0)=${papeleta}`);
    return { balance, acepta, papeleta };
  },

  //----------------------------------------------------------------------------

  async hacerOptIn(mnemonico, assetId) {
    const cuenta = algosdk.mnemonicToSecretKey(mnemonico);
    if (!cuenta || !cuenta.addr || !cuenta.sk) {
      throw new Error("Cuenta inválida o mnemonico incorrecto.");
    }

    console.log("Haciendo opt-in para la cuenta:", cuenta.addr.toString(), "con assetId:", assetId);

    const params = await algod.getTransactionParams().do();
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      sender: cuenta.addr,
      receiver: cuenta.addr,
      amount: 0,
      assetIndex: Number(assetId),
      suggestedParams: params,
    });

    const signedTxn = txn.signTxn(cuenta.sk);
    const respSRT = await algod.sendRawTransaction(signedTxn).do();
    const txId = respSRT.txId ? respSRT.txId : respSRT.txid ? respSRT.txid : "null";
    console.log("Opt-in txId:", txId);

    await algosdk.waitForConfirmation(algod, txId, 4);
    return txId;
  },

  //----------------------------------------------------------------------------

  async _consultarTransaccionAsset(addr, assetId, role) {
    const respSearch = await indexer.searchForTransactions()
      .address(addr)
      .addressRole(role)
      .assetID(assetId)
      .txType('axfer')
      .do();

    const txns = Array.isArray(respSearch.transactions) ? respSearch.transactions : [];

    const buscarAssetTransfer = (t) => {
      if (t.txType === 'appl' && t.innerTxns && t.innerTxns.length > 0) {
        return t.innerTxns.find(i => i.assetTransferTransaction && i.assetTransferTransaction.amount > 0);
      } else if (t.txType === 'axfer') {
        return t.assetTransferTransaction && t.assetTransferTransaction.amount > 0;
      }
    };

    let txnAxfer = txns.find(buscarAssetTransfer);

    return txnAxfer || null;
  },

  async consultarPapeletaRecibida(addr, assetId) {
    const papeletaRx = await this._consultarTransaccionAsset(addr, assetId, 'receiver');

    if (!papeletaRx) {
      console.log("No se ha recibido la papeleta (transferencia con cantidad > 0).");
      return null;
    }

    const roundTime = papeletaRx.roundTime;
    const date = new Date(roundTime * 1000);
    console.log("Se ha recibido la papeleta.", date.toISOString(), papeletaRx);
    return { date, txId: papeletaRx.id };
  },

  async consultarPapeletaEnviada(addr, assetId) {
    const papeletaTx = await this._consultarTransaccionAsset(addr, assetId, 'sender');

    if (!papeletaTx) {
      console.log("Todavía no se ha emitido el voto.");
      return null;
    }

    console.log("Ya se ha emitido el voto.", papeletaTx);
    const txId = papeletaTx.id;
    const nota = papeletaTx.note ? this.fromNote(papeletaTx.note) : {};
    const roundTime = papeletaTx.roundTime;
    const date = new Date(roundTime * 1000);
    console.log("Nota de la transacción:", date.toISOString(), txId, nota);
    return { date, txId, nota };
  },

  //----------------------------------------------------------------------------

  async votar(mnemonico, appAddr, assetId, voto) {
    const cuenta = algosdk.mnemonicToSecretKey(mnemonico);
    if (!cuenta || !cuenta.addr || !cuenta.sk) {
      throw new Error("Cuenta inválida o mnemonico incorrecto.");
    }

    const params = await algod.getTransactionParams().do();

    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      sender: cuenta.addr,
      receiver: appAddr,
      amount: 1n,
      assetIndex: Number(assetId),
      suggestedParams: params,
      note: this.toNote(voto),
    });

    const signedTxn = txn.signTxn(cuenta.sk);
    const respSRT = await algod.sendRawTransaction(signedTxn).do();
    const txId = respSRT.txId ? respSRT.txId : respSRT.txid ? respSRT.txid : "null";
    console.log("Envío asset txID:", txId);

    await algosdk.waitForConfirmation(algod, txId, 4);
    return txId;
  },

  //----------------------------------------------------------------------------

  toNote(json) {
    return codificador.encode(JSON.stringify(json));
  },

  fromNote(bytes) {
    return JSON.parse(decodificador.decode(bytes));
  },

  //----------------------------------------------------------------------------

  urlApplication(appId) {
    return appId ? `${explorer}${explorerApplication}${appId}` : explorer;
  },
  urlAccount(address) {
    return address ? `${explorer}${explorerAccount}${address}` : explorer;
  },
  urlAsset(assetId) {
    return assetId ? `${explorer}${explorerAsset}${assetId}` : explorer;
  },
  urlTransaction(txId) {
    return txId ? `${explorer}${explorerTransaction}${txId}` : explorer;
  },
}
