import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
import fs from 'node:fs/promises';

import { 
  calcularPoseidonCircom, 
  calcularPoseidonLite,
  calcularPoseidon2ZkPassport,
  calcularPoseidon2Noir, 
  hexStr2BigInt, 
  bigInt2HexStr } from '../../src/utiles/utilesCrypto.js';

const contenido = await fs.readFile('./target/merkle11.json', 'utf8');
const merkle11 = JSON.parse(contenido);

async function main() {
  // Instancia Noir y el backend
  const noir = new Noir(merkle11);
  const backend = new UltraHonkBackend(merkle11.bytecode);

  // --- Prepara los inputs de forma consistente ---
  const DEPTH = 11;
  const clave = 123n;
  const nullifier = 456n;
  const path = Array(DEPTH).fill(0n);
  const path_indices = Array(DEPTH).fill(0n);

  // 1. Calcula la hoja (leaf) como en Noir
  const leaf = calcularPoseidonCircom([clave, nullifier]);
  console.log('Leaf:', bigInt2HexStr(leaf));

  // 2. Calcula la raiz (root) subiendo por el arbol, como en Noir
  let current_hash = leaf;
  for (let i = 0; i < DEPTH; i++) {
    const path_element = path[i];
    const is_right = path_indices[i];

    const left = is_right === 0n ? current_hash : path_element;
    const right = is_right === 0n ? path_element : current_hash;

    current_hash = calcularPoseidonCircom([left, right]);
    console.log('Hash:', bigInt2HexStr(current_hash));
  }
  const root = current_hash; // Esta es la raiz correcta
  console.log('Root:', bigInt2HexStr(root));

  // 3. Calcula el nullifier_hash como en Noir
  const nullifier_hash = calcularPoseidonCircom([nullifier]);

  // --- Prepara el objeto de inputs final ---
  const inputs = {
    clave: clave.toString(),
    nullifier: nullifier.toString(),
    path: path.map(x => x.toString()),
    path_indices: path_indices.map(x => x.toString()),
    root: root.toString(),
    nullifier_hash: nullifier_hash.toString(),
  };

  console.log('Inputs:', inputs);

  const { witness, returnValue } = await noir.execute(inputs);

  console.log('Witness:', witness);
  console.log('Return Value:', returnValue);

  // Genera la prueba
  // const { proof, publicInputs } = await backend.generateProof(witness);

  // Verifica la prueba
  // const verified = await backend.verifyProof({ proof, publicInputs });

  // console.log('Public Inputs:', publicInputs);
  // console.log('Proof verified:', verified);
}

main().catch(console.error);
