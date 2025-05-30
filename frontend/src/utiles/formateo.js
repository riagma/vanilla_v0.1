export function formatearFecha(fecha) {
  const opcionesFecha = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric'
  };
  return new Date(fecha).toLocaleDateString('es-ES', opcionesFecha);
}