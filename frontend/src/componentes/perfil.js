import { observarContexto } from '../contexto.js';

export function Perfil(contenedor) {
    // Mantener estado de montado
    let estaMontado = true;

    function renderizar() {
        // Solo renderizar si el componente sigue montado
        if (!estaMontado) return;

        contenedor.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Perfil de ${contexto.usuario?.nombre || 'Usuario'}</h5>
                    <!-- ... resto del HTML ... -->
                </div>
            </div>
        `;
    }

    // Suscribirse a cambios cuando se monta el componente
    const cancelarSuscripcion = observarContexto(renderizar);

    // Renderizado inicial
    renderizar();

    // Función de limpieza
    function desmontar() {
        estaMontado = false;
        cancelarSuscripcion();
        contenedor.innerHTML = ''; // Limpiar contenido
    }

    return desmontar;
}