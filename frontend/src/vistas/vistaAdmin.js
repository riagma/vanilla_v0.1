import { api } from '../servicios/api.js';

export async function vistaAdmin(contenedor) {
    let elecciones = [];
    
    async function cargarElecciones() {
        try {
            elecciones = await api.get('/api/admin/elecciones');
            renderizarElecciones();
        } catch (error) {
            console.error('Error al cargar elecciones:', error);
            mostrarError('Error al cargar las elecciones');
        }
    }

    function mostrarError(mensaje) {
        const alertaError = document.getElementById('alertaError');
        alertaError.textContent = mensaje;
        alertaError.style.display = 'block';
    }

    function renderizarElecciones() {
        contenedor.innerHTML = `
            <div class="container mt-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Panel de Administración</h2>
                    <button class="btn btn-primary" onclick="crearEleccion()">
                        Nueva Elección
                    </button>
                </div>

                <div id="alertaError" class="alert alert-danger" style="display: none"></div>

                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Estado</th>
                                <th>Inicio Registro</th>
                                <th>Fin Registro</th>
                                <th>Inicio Votación</th>
                                <th>Fin Votación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${elecciones.map(eleccion => `
                                <tr>
                                    <td>${eleccion.nombre}</td>
                                    <td>
                                        <span class="badge bg-${obtenerColorEstado(eleccion.estado)}">
                                            ${eleccion.estado}
                                        </span>
                                    </td>
                                    <td>${new Date(eleccion.fechaInicioRegistro).toLocaleDateString()}</td>
                                    <td>${new Date(eleccion.fechaFinRegistro).toLocaleDateString()}</td>
                                    <td>${new Date(eleccion.fechaInicioVotacion).toLocaleDateString()}</td>
                                    <td>${new Date(eleccion.fechaFinVotacion).toLocaleDateString()}</td>
                                    <td>
                                        <div class="btn-group btn-group-sm">
                                            <button class="btn btn-outline-primary" 
                                                    onclick="editarEleccion(${eleccion.id})">
                                                Editar
                                            </button>
                                            <button class="btn btn-outline-danger" 
                                                    onclick="eliminarEleccion(${eleccion.id})">
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Registrar manejadores de eventos
        window.crearEleccion = async () => {
            // TODO: Implementar creación
            console.log('Crear elección');
        };

        window.editarEleccion = async (id) => {
            // TODO: Implementar edición
            console.log('Editar elección:', id);
        };

        window.eliminarEleccion = async (id) => {
            if (confirm('¿Está seguro de eliminar esta elección?')) {
                try {
                    await api.del(`/api/admin/elecciones/${id}`);
                    await cargarElecciones();
                } catch (error) {
                    mostrarError('Error al eliminar la elección');
                }
            }
        };
    }

    function obtenerColorEstado(estado) {
        const colores = {
            'PENDIENTE': 'secondary',
            'REGISTRO': 'primary',
            'VOTACION': 'success',
            'CERRADA': 'danger'
        };
        return colores[estado] || 'secondary';
    }

    // Cargar elecciones al montar el componente
    await cargarElecciones();

    // Retornar función de limpieza
    return () => {
        elecciones = [];
        // Limpiar manejadores globales
        window.crearEleccion = undefined;
        window.editarEleccion = undefined;
        window.eliminarEleccion = undefined;
    };
}