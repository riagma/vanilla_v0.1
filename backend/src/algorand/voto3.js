import algorand from './algorand.js';
import { randomBytes } from 'node:crypto';
import { ABIMethod } from 'algosdk';

// const appId = Number(ELECTION_APP_ID);
// const account = algorand.account.fromMnemonic(ELECTION_MNEMONIC);

const ABIinicializarEleccion = new ABIMethod({
  name: 'inicializar_eleccion',
  args: [],
  returns: { type: 'void' },
});

const ABIregistrarCompromiso = new ABIMethod({
  name: 'registrar_compromiso',
  args: [],
  returns: { type: 'void' },
});

export async function inicializarEleccion(sender, appId, args = []) {
  const { txId, confirmation  } = await algorand.send.appCallMethodCall({
    sender,
    appId,
    method: ABIinicializarEleccion,
    args,
    skipWaiting: false,
    skipSimulate: true,
    maxRoundsToWaitForConfirmation: 12,
    maxFee: (2000).microAlgos(),
    extraFee: (1000).microAlgos(),
  });
  console.log(`Elección inicializada en la ronda ${confirmation?.confirmedRound}`);
  return { txId, confirmedRound: confirmation?.confirmedRound ?? 0n };
}

export async function registrarCompromiso() {
  const { txId, confirmation  } = await algorand.send.appCallMethodCall({
    sender: account.addr,
    appId,
    method: ABIregistrarCompromiso,
    args: [],
    lease: Uint8Array.from(randomBytes(32)),
    skipWaiting: false,
    skipSimulate: true, 
    maxRoundsToWaitForConfirmation: 12,
    maxFee: (2000).microAlgos(),
  });
  console.log(`Compromiso registrado en la ronda ${confirmation?.confirmedRound}`);
  return { txId, confirmedRound: confirmation?.confirmedRound ?? 0n };
}
