function completarConCeros(valor: number, largo: number): string {
  return String(valor).padStart(largo, '0');
}

/** 48500 → "48.500,00" */
export function formatearMonto(importe: number): string {
  const [entero, decimales] = importe.toFixed(2).split('.');
  const enteroConMiles = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${enteroConMiles},${decimales}`;
}

/** 48500 → "$ 48.500,00" */
export function formatearImporte(importe: number): string {
  return `$ ${formatearMonto(importe)}`;
}

/** ("C", 4, 1234) → "C 0004-00001234" */
export function formatearComprobante(letra: string, puntoVenta: number, numero: number): string {
  return `${letra} ${completarConCeros(puntoVenta, 4)}-${completarConCeros(numero, 8)}`;
}

/** "20123456786" → "20-12345678-6" */
export function formatearCuit(cuit: string): string {
  if (!/^\d{11}$/.test(cuit)) return cuit;
  return `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}`;
}

/** 2 de octubre → "02/10" */
export function formatearDiaMes(fecha: Date): string {
  return `${completarConCeros(fecha.getDate(), 2)}/${completarConCeros(fecha.getMonth() + 1, 2)}`;
}

/** "2026-10-02" → "02/10/2026" */
export function formatearFechaIso(fechaIso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaIso)) return '';
  const [anio, mes, dia] = fechaIso.split('-');
  return `${dia}/${mes}/${anio}`;
}

/** 4 → "0004" */
export function completarPuntoVenta(puntoVenta: number): string {
  return completarConCeros(puntoVenta, 4);
}

/** 1234 → "00001234" */
export function completarNumero(numero: number): string {
  return completarConCeros(numero, 8);
}

/** 2 de octubre de 2026, 12:50 → "02/10/2026 · 12:50" */
export function formatearFechaHora(fecha: Date): string {
  const dia = `${completarConCeros(fecha.getDate(), 2)}/${completarConCeros(fecha.getMonth() + 1, 2)}/${fecha.getFullYear()}`;
  return `${dia} · ${completarConCeros(fecha.getHours(), 2)}:${completarConCeros(fecha.getMinutes(), 2)}`;
}
