// Utilidad para generar salt aleatorio (hex)
export function generarSalt(longitud = 16) {
  const array = new Uint8Array(longitud);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Derivar clave con PBKDF2 (AES-GCM 256 bits)
export async function derivarClave(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100_000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Hash SHA-256 para autenticación (no para cifrado)
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Encriptar datos con clave derivada (AES-GCM)
export async function encriptar(objeto, claveDerivada) {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const datosCodificados = enc.encode(JSON.stringify(objeto));
  const cifrado = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    claveDerivada,
    datosCodificados
  );
  return {
    iv: Array.from(iv),
    cifrado: Array.from(new Uint8Array(cifrado))
  };
}

// Desencriptar datos con clave derivada (AES-GCM)
export async function desencriptar(objetoCifrado, claveDerivada) {
  const { iv, cifrado } = objetoCifrado;
  const dec = new TextDecoder();
  const bufferIv = new Uint8Array(iv);
  const bufferCifrado = new Uint8Array(cifrado); 
  const descifrado = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: bufferIv },
    claveDerivada,
    bufferCifrado
  );
  return JSON.parse(dec.decode(descifrado));
}