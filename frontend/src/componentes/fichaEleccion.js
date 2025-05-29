export function fichaEleccion(eleccion) {
    return `
        <div class="col">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${eleccion.nombre}</h5>
                    <p class="card-text">${eleccion.descripcion}</p>
                    <div class="mb-2">
                        <small class="text-muted">
                            Estado: ${eleccion.estado}
                        </small>
                    </div>
                    <button class="btn btn-primary"
                            onclick="window.verDetalleEleccion(${eleccion.id})">
                        Ver Detalles
                    </button>
                </div>
                <div class="card-footer">
                    <small class="text-muted">
                        Votación: ${new Date(eleccion.fechaInicioVotacion).toLocaleDateString()} 
                        - ${new Date(eleccion.fechaFinVotacion).toLocaleDateString()}
                    </small>
                </div>
            </div>
        </div>
    `;
}