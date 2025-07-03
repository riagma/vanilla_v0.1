// Date a "YYYY-MM-DD" (local)
export function formatearFecha(date = null, { incYY = 0, incMM = 0, incDD = 0 } = {}) {
  let d = date ? new Date(date) : new Date();
  d.setFullYear(d.getFullYear() + incYY);
  d.setMonth(d.getMonth() + incMM);
  d.setDate(d.getDate() + incDD);
  const YY = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const DD = String(d.getDate()).padStart(2, '0');
  return `${YY}-${MM}-${DD}`;
}

// Date a "YYYY-MM-DD HH:MM:SS" (local)
export function formatearFechaHora(date = null, { incYY = 0, incMM = 0, incDD = 0, incHH = 0, incMI = 0, incSS = 0 } = {}) {
  let d = date ? new Date(date) : new Date();
  d.setFullYear(d.getFullYear() + incYY);
  d.setMonth(d.getMonth() + incMM);
  d.setDate(d.getDate() + incDD);
  d.setHours(d.getHours() + incHH);
  d.setMinutes(d.getMinutes() + incMI);
  d.setSeconds(d.getSeconds() + incSS);
  const YY = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const DD = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const MI = String(d.getMinutes()).padStart(2, '0');
  const SS = String(d.getSeconds()).padStart(2, '0');
  return `${YY}-${MM}-${DD} ${HH}:${MI}:${SS}`;
}

// "YYYY-MM-DD" a Date (local)
export function parsearFecha(fecha, { incYY = 0, incMM = 0, incDD = 0 }) {
  // Espera formato "YYYY-MM-DD"
  const [YY, MM, DD] = fecha.split('-').map(Number);
  return new Date(YY + incYY, MM - 1 + incMM, DD + incDD);
}

// "YYYY-MM-DD HH:MM:SS" a Date (local)
export function parsearFechaHora(fechaHora, { incYY = 0, incMM = 0, incDD = 0, incHH = 0, incMI = 0, incSS = 0 }) {
  const [fecha, hora] = fechaHora.split(' ');
  const [YY, MM, DD] = fecha.split('-').map(Number);
  const [HH, MI, SS] = hora.split(':').map(Number);
  return new Date(YY + incYY, MM - 1 + incMM, DD + incDD, HH + incHH, MI + incMI, SS + incSS);
}

// "YYYY-MM-DD HH:MM:SS" a "YYYY-MM-DD HH:MM:SS" (local)
export function calcularFechaHora(fechaHora = null, { incYY = 0, incMM = 0, incDD = 0, incHH = 0, incMI = 0, incSS = 0 }) {
  if (!fechaHora) {
    return formatearFechaHora(new Date(), { incYY, incMM, incDD, incHH, incMI, incSS });
  } else {
    return formatearFechaHora(parsearFechaHora(fechaHora), { incYY, incMM, incDD, incHH, incMI, incSS });
  }
}
