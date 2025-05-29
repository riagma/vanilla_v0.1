import { contexto, observarContexto, logout } from '../contexto.js';

export function inicializarHeader(headerAcciones) {
    function actualizarHeader() {
        headerAcciones.innerHTML = contexto.token 
            ? `<button id="btnLogout" class="btn btn-outline-light btn-sm">Cerrar Sesión</button>`
            : '';
            
        // Añadir event listener si existe el botón
        const btnLogout = document.getElementById('btnLogout');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                logout();
            });
        }
    }

    // Suscribirse solo a cambios de autenticación
    const cancelarSuscripcion = observarContexto(actualizarHeader);

    // Renderizado inicial
    actualizarHeader();

    // Retornar función de limpieza
    return cancelarSuscripcion;
}