import algorand, { account } from './algorand.js';
import { randomBytes } from 'node:crypto';
import { ABIMethod } from 'algosdk';

const appId = Number(process.env.APP_ID);

const ABIregistrarCompromiso = new ABIMethod({
  name: 'registrar_compromiso',
  args: [],
  returns: { type: 'void' },
});

export async function registrarCompromiso() {
  const { txId, confirmation  } = await algorand.send.appCallMethodCall({
    sender: account.addr,
    appId,
    method: ABIregistrarCompromiso,
    args: [],
    lease: Uint8Array.from(randomBytes(32)),
    skipWaiting: false,
    maxRoundsToWaitForConfirmation: 12,
    skipSimulate: true, 
  });
  console.log(`Compromiso registrado en la ronda ${confirmation?.confirmedRound}`);
  return { txId, confirmedRound: confirmation?.confirmedRound ?? 0n };
}
