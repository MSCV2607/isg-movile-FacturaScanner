/** "20-12345678-6" → "20123456786" */
export function soloDigitos(texto: string): string {
  return texto.replace(/\D/g, '');
}

/**
 * "48.500,00" → 48500 (formato argentino). También acepta "48500.50".
 * Devuelve NaN si no es un número.
 */
export function parsearImporte(texto: string): number {
  const limpio = texto.trim();
  if (limpio === '') return NaN;
  if (limpio.includes(',')) return Number(limpio.replace(/\./g, '').replace(',', '.'));
  // Sin coma: un único punto con 1-2 decimales se toma como decimal ("48500.5").
  if (/^\d+\.\d{1,2}$/.test(limpio)) return Number(limpio);
  return Number(limpio.replace(/\./g, ''));
}

/** "02/10/2026" → "2026-10-02". Devuelve '' si no tiene el formato esperado. */
export function parsearFechaALaIso(texto: string): string {
  const partes = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(texto.trim());
  if (!partes) return '';
  const [, dia, mes, anio] = partes;
  return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

/** "https://api.empresa.com/facturas?x=1" → "/facturas" */
export function extraerRuta(url: string): string {
  const sinEsquema = url.trim().replace(/^https?:\/\/[^/]+/i, '');
  const ruta = sinEsquema.split(/[?#]/)[0];
  return ruta === '' ? '/' : ruta;
}
