import { createHash } from 'crypto';
import { MerkleTree } from 'merkletreejs';

function hash(data) {
  // Si tus compromisos ya son hash, simplemente return Buffer.from(data, 'hex')
  return createHash('sha256').update(data).digest();
}

const leaves = hojas.map(hash);

const tree = new MerkleTree(leaves, hash, { sortPairs: true });

// Obtener la raíz:
const root = tree.getRoot().toString('hex');

// Guardar árbol completo (ejemplo: serializar las hojas y raíz)
import fs from 'node:fs';

fs.writeFileSync('arbol-merkle.json', JSON.stringify({
  root,
  leaves: hojas,
}, null, 2));
