import algosdk from 'algosdk';

// const localNetAlgod = new algosdk.Algodv2('', 'http://localhost', '4001');
// const localNetIndexer = new algosdk.Indexer('', 'http://localhost', 8980);

// const testNetAlgod = new algosdk.Algodv2('', 'http://localhost', '4001');
// const testNetIndexer = new algosdk.Indexer('', 'http://localhost', 8980);

// const mainNetAlgod = new algosdk.Algodv2('', 'http://localhost', '4001');
// const mainNetIndexer = new algosdk.Indexer('', 'http://localhost', 8980);

let algod = null;
let indexer = null;

let explorer = null;
let explorerAccount = null;
let explorerAsset = null;
let explorerApplication = null;
let explorerTransaction = null;

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

const codificador = new TextEncoder();
const decodificador = new TextDecoder();

export const servicioAlgorand = {

  crearCuentaAleatoria() {
    const cuenta = algosdk.generateAccount();
    // console.log("Cuenta creada:", cuenta.addr);
    // console.log("Mnemonic:", algosdk.secretKeyToMnemonic(cuenta.sk));
    return { cuentaAddr: cuenta.addr.toString(), mnemonico: algosdk.secretKeyToMnemonic(cuenta.sk) };
  },

  async hacerOptIn(mnemonico, assetId) {
    const cuenta = algosdk.mnemonicToSecretKey(mnemonico);
    if (!algod) {
      throw new Error("El cliente Algorand no está configurado.");  
    }
    console.log("Haciendo opt-in para la cuenta:", cuenta.addr);

    const params = await algod.getTransactionParams().do();

    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: cuenta.addr,
      to: cuenta.addr,
      amount: 0,
      assetIndex: assetId,
      suggestedParams: params,
    });

    const signedTxn = txn.signTxn(cuenta.sk);
    const { txId } = await algod.sendRawTransaction(signedTxn).do();
    console.log("Opt-in txID:", txId);

    await algosdk.waitForConfirmation(algod, txId, 4);
    return txId;
  },

  async revisarOptIn(addr, assetId) {
    const cuentaInfo = await algod.accountInformation(addr).do();
    const tiene = cuentaInfo.assets.find(a => a['asset-id'] === assetId);
    console.log(tiene ? "Ya está opt-in" : "No ha hecho opt-in");
    return tiene ? true : false;
  },

  async revisarBalance(addr) {
    const cuentaInfo = await algod.accountInformation(addr).do();
    console.log(`Balance: ${cuentaInfo.amount} microALGOs`);
    return Number(cuentaInfo.amount);
  },

  async consultarPapeletaRecibida(addr, assetId) {
    const txns = await indexer.searchForTransactions()
      .address(addr)
      .addressRole('receiver')
      .assetID(assetId)
      .txType('axfer')
      .limit(1)
      .do();

    if (txns.transactions.length === 0) {
      console.log("No se ha recibido la papeleta.");
      return null;
    } else {
      const roundTime = txns.transactions[0].roundTime;
      const date = new Date(roundTime * 1000);
      console.log("Se ha recibido la papeleta.", date.toISOString(), txns.transactions[0]);
      return { date, txId: txns.transactions[0].id };
    }
  },

  async votar(cuenta, receptor) {
    const params = await algod.getTransactionParams().do();

    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: cuenta.addr,
      to: receptor,
      amount: 1,
      assetIndex: assetId,
      suggestedParams: params,
    });

    const signedTxn = txn.signTxn(cuenta.sk);
    const { txId } = await algod.sendRawTransaction(signedTxn).do();
    console.log("Envío asset txID:", txId);

    await algosdk.waitForConfirmation(algod, txId, 4);
    return txId;
  },

  async consultarPapeletaEnviada(addr, assetId) {
    const txns = await indexer.searchForTransactions()
      .address(addr)
      .addressRole('sender')
      .assetID(assetId)
      .txType('axfer')
      .limit(1)
      .do();

    if (txns.transactions.length === 0) {
      console.log("No se ha recibido la papeleta.");
      return null;
    } else {
      console.log("Se ha recibido la papeleta.", txns.transactions[0]);
      const txId = txns.transactions[0].id;
      const nota = txns.transactions[0].note ? this.fromNote(txns.transactions[0].note) : {};
      const roundTime = txns.transactions[0].roundTime;
      const date = new Date(roundTime * 1000);
      console.log("Nota de la transacción:", date.toISOString(), txId, nota);
      return { date, txId: txns.transactions[0].id, nota };
    }
  },

  toNote(json) {
    return codificador.encode(JSON.stringify(json));
  },

  fromNote(bytes) {
    return JSON.parse(decodificador.decode(bytes));
  },

  async consultarSaldo(cuentaAddr) {
    const cuentaInfo = await algodClient.accountInformation(address).do();
    console.log("Saldo:", cuentaInfo.amount); // El saldo está en microAlgos
    return cuentaInfo.amount;
  },

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
