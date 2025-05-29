import { contexto } from '../contexto.js';
import { api } from '../servicios/api.js';
import { fichaEleccion } from '../componentes/fichaEleccion.js';

export async function vistaVotante(contenedor) {
    let elecciones = [];
    
    async function cargarElecciones() {
        try {
            const respuesta = await api.get('/api/votante/elecciones');
            elecciones = Array.isArray(respuesta) ? respuesta : [];
            console.log('Elecciones cargadas:', elecciones); // Debug
            renderizarElecciones();
        } catch (error) {
            console.error('Error al cargar elecciones:', error);
            mostrarError('Error al cargar las elecciones disponibles');
        }
    }

    function mostrarError(mensaje) {
        contenedor.innerHTML = `
            <div class="container mt-4">
                <div class="alert alert-danger" role="alert">
                    ${mensaje}
                </div>
            </div>
        `;
    }

    function renderizarElecciones() {
        if (!Array.isArray(elecciones) || elecciones.length === 0) {
            contenedor.innerHTML = `
                <div class="container mt-4">
                    <h2 class="mb-4">Elecciones Disponibles</h2>
                    <div class="alert alert-info">
                        No hay elecciones disponibles en este momento.
                    </div>
                </div>
            `;
            return;
        }

        contenedor.innerHTML = `
            <div class="container mt-4">
                <h2 class="mb-4">Elecciones Disponibles</h2>
                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    ${elecciones.map(eleccion => fichaEleccion(eleccion)).join('')}
                </div>
            </div>
        `;

        // Registrar manejador global para ver detalles
        window.verDetalleEleccion = (id) => {
            console.log('Ver detalle de elección:', id);
            // TODO: Implementar navegación a detalle
        };
    }

    // Cargar elecciones al montar el componente
    await cargarElecciones();

    // Retornar función de limpieza
    return () => {
        elecciones = [];
        // Limpiar manejador global
        window.verDetalleEleccion = undefined;
    };
}