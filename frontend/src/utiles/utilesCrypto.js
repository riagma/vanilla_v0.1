import { poseidon2Hash, poseidon2HashAsync } from "@zkpassport/poseidon2"

const codificador = new TextEncoder();
const decodificador = new TextDecoder();

//----------------------------------------------------------------------------

export function calcularPoseidon2(datos) {

  const inputs = Array.isArray(datos) ? datos : [datos];

  for (const x of inputs) {
    if (typeof x !== 'bigint') {
      throw new Error('Todos los elementos de entrada deben ser BigInt');
    }
  }

  return poseidon2Hash(inputs);
}

//----------------------------------------------------------------------------

export async function calcularPoseidon2Async(datos) {

  const inputs = Array.isArray(datos) ? datos : [datos];

  for (const x of inputs) {
    if (typeof x !== 'bigint') {
      throw new Error('Todos los elementos de entrada deben ser BigInt');
    }
  }

  return await poseidon2HashAsync(inputs);
}

//----------------------------------------------------------------------------

export async function calcularSha256(datos) {
  const data = codificador.encode(datos);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function randomBigInt(bytes = 24) {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return BigInt('0x' + Array.from(array).map(b => b.toString(16).padStart(2, '0')).join(''));
}

export async function hashPassword(password) {
  const data = codificador.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

//----------------------------------------------------------------------------

export function hexToBytes(hex) {
  if (hex.length % 2 !== 0) throw new Error('Hex inválido');
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return arr;
}

export function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

export function generarSalt(longitud = 16) {
  const array = new Uint8Array(longitud);
  crypto.getRandomValues(array);
  return bytesToHex(array);
}

export async function generarSaltSemilla(semilla) {
  const data = codificador.encode(semilla);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const array = new Uint8Array(hashBuffer).slice(0, 16);
  return bytesToHex(array);
}

export async function derivarClave(claveTexto, saltHex) {
  const claveBase = await crypto.subtle.importKey(
    'raw', codificador.encode(claveTexto), { name: 'PBKDF2' }, false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: hexToBytes(saltHex),
      iterations: 100_000,
      hash: 'SHA-256',
    },
    claveBase,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

//----------------------------------------------------------------------------

export async function encriptar(cadena, claveDerivada) {
  const vectorInicial = crypto.getRandomValues(new Uint8Array(12));
  const datos = codificador.encode(cadena);
  const cifrado = new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: vectorInicial }, claveDerivada, datos
  ));
  // Formato: sal(16) + vectorInicial(12) + cifrado(n)
  const resultado = new Uint8Array(16 + 12 + cifrado.length);
  resultado.set(crypto.getRandomValues(new Uint8Array(16)), 0);
  resultado.set(vectorInicial, 16);
  resultado.set(cifrado, 28);
  // Conversión a base64 (navegador puro, sin Buffer)
  return btoa(String.fromCharCode(...resultado));
}

//----------------------------------------------------------------------------

export async function desencriptar(cifradoBase64, claveDerivada) {
  try {
    const binario = Uint8Array.from(atob(cifradoBase64), c => c.charCodeAt(0));
    const vectorInicial = binario.slice(16, 28);
    const cifrado = binario.slice(28);
    const plano = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: vectorInicial }, claveDerivada, cifrado
    );
    return decodificador.decode(plano);
  } catch (e) {
    console.error("Error al desencriptar:", e);
    throw e;
  }
}

//----------------------------------------------------------------------------

export async function encriptarJSON(objeto, claveDerivada) {
  return await encriptar(JSON.stringify(objeto), claveDerivada);
}

export async function desencriptarJSON(cifradoBase64, claveDerivada) {
  try {
    const cadena = await desencriptar(cifradoBase64, claveDerivada);
    return JSON.parse(cadena);
  } catch (e) {
    throw e; // Reenvía la excepción
  }
}

//----------------------------------------------------------------------------

export async function desencriptarNode(cifradoBase64, claveTexto) {
  try {
    const binario = Uint8Array.from(atob(cifradoBase64), c => c.charCodeAt(0));
    const salt = binario.slice(0, 16);
    const vectorInicial = binario.slice(16, 28);
    const cifrado = binario.slice(28);
    const clave = await derivarClave(claveTexto, bytesToHex(salt));
    const plano = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: vectorInicial }, clave, cifrado
    );
    return decodificador.decode(plano);
  } catch (e) {
    console.error("Error al desencriptar:", e);
    throw e;
  }
}

//----------------------------------------------------------------------------


export async function desencriptarNodeJSON(cifradoBase64, claveDerivada) {
  try {
    const cadena = await desencriptarNode(cifradoBase64, claveDerivada);
    return JSON.parse(cadena);
  } catch (e) {
    throw e; // Reenvía la excepción
  }
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
