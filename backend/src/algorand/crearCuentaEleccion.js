import algorand, { dispenser }  from "./algorand.js";
import algosdk from 'algosdk';

export async function crearCuentaEleccion(nombreEleccion) {

  console.log(`Creando cuenta para la elección: ${nombreEleccion}`);

  const cuentaEleccion = algorand.account.random();
  console.log('Address :', String(cuentaEleccion.addr));

  const secretKey = cuentaEleccion.account.sk; 
  console.log('SecretK :', Buffer.from(secretKey).toString('base64'));

  const mnemonic = algosdk.secretKeyToMnemonic(secretKey);
  console.log('Mnemonic:', mnemonic);

  await algorand.send.payment({
    sender: dispenser,
    receiver: cuentaEleccion,
    amount: (1000).algo(),
    note: `Cuenta para la eleccion ${nombreEleccion}`,
  });

  return {
    direccion: String(cuentaEleccion.addr),
    mnemotecnico: mnemonic,
 };
}
