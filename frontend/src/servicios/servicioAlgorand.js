import algosdk from 'algosdk';

const algod = new algosdk.Algodv2('', 'http://localhost:4001', '');
const indexer = new algosdk.Indexer('', 'http://localhost:8980', '');

const codificador = new TextEncoder();
const decodificador = new TextDecoder();

export const servicioAlgorand = {

    crearCuentaAleatoria() {
        const cuenta = algosdk.generateAccount();
        console.log("Cuenta creada:", cuenta.addr);
        console.log("Mnemonic:", algosdk.secretKeyToMnemonic(cuenta.sk));
        return cuenta;
    },

    async hacerOptIn(cuenta) {
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

    async revisarOptIn(assetId) {
        const cuentaInfo = await algod.accountInformation(cuenta.addr).do();
        const tiene = cuentaInfo.assets.find(a => a['asset-id'] === assetId);
        console.log(tiene ? "Ya está opt-in" : "No ha hecho opt-in");
    },

    async consultarPapeletaRecibida(addr) {
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
            console.log("Se ha recibido la papeleta.", txns.transactions[0]);
            return txns.transactions[0].id;
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
        console.log("📤 Envío asset txID:", txId);

        await algosdk.waitForConfirmation(algod, txId, 4);
        return txId;
    },

    async consultarPapeletaEnviada(addr) {
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
            const nota = txns.transactions[0].note ? fromNote(txns.transactions[0].note) : {};
            console.log("Nota de la transacción:", txId, nota);
            return { txId: txns.transactions[0].id, nota };
        }
    },

    toNote(json) {
        const str = JSON.stringify(json);
        return codificador.encode(str);
    },

    fromNote(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        const str = decodificador.decode(bytes);
        return JSON.parse(str);
    },

    async consultarSaldo(cuentaAddr) {
        const cuentaInfo = await algodClient.accountInformation(address).do();
        console.log("Saldo:", cuentaInfo.amount); // El saldo está en microAlgos
        return cuentaInfo.amount;
    },
}
