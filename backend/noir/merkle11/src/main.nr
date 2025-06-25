use poseidon::poseidon2;

global DEPTH: u32 = 11;

fn main(
    // Entradas privadas
    clave: Field,
    nullifier: Field,
    path: [Field; DEPTH],         // Camino de hermanos desde hoja hasta raiz
    path_indices: [Field; DEPTH], // 0 = izquierda, 1 = derecha para cada nivel

    // Entradas publicas
    root: pub Field,              // Raiz del arbol Merkle
    nullifier_hash: pub Field     // Hash del nullifier para evitar doble gasto
) -> pub Field {
    // 1. Calcular la hoja a partir de clave + nullifier usando Poseidon2
    let leaf = poseidon2::Poseidon2::hash([clave, nullifier], 2);

    // 2. Verificar que el nullifier_hash publico corresponde al nullifier privado
    let computed_nullifier_hash = poseidon2::Poseidon2::hash([nullifier], 1);
    assert(computed_nullifier_hash == nullifier_hash);
    
    // 3. Verificar el camino Merkle desde la hoja hasta la raiz
    let mut current_hash = leaf;

    for i in 0..DEPTH {
        let path_element = path[i];
        let is_right = path_indices[i];

        // Si is_right == 0, current_hash va a la izquierda
        // Si is_right == 1, current_hash va a la derecha
        let left = if is_right == 0 { current_hash } else { path_element };
        let right = if is_right == 0 { path_element } else { current_hash };

        current_hash = poseidon2::Poseidon2::hash([left, right], 2);
    }

    // 4. Verificar que llegamos a la raiz esperada
    assert(current_hash == root);
    current_hash
    
}

#[test]
fn test_merkle_proof() {
    let clave = 123;
    let nullifier = 456;
    let nullifier_hash = poseidon2::Poseidon2::hash([nullifier], 1);

    let path: [Field; 11] = [0; 11];
    let path_indices: [Field; 11] = [0; 11];

    // Calcula la hoja
    let leaf = poseidon2::Poseidon2::hash([clave, nullifier], 2);
    let mut current_hash = leaf;
    for i in 0..11 {
        let path_element = path[i];
        let is_right = path_indices[i];
        let left = if is_right == 0 { current_hash } else { path_element };
        let right = if is_right == 0 { path_element } else { current_hash };
        current_hash = poseidon2::Poseidon2::hash([left, right], 2);
    }
    let root = current_hash;

    let result = main(clave, nullifier, path, path_indices, root, nullifier_hash);
    assert(result == root);
}
