/** true si el texto es una fecha real con formato AAAA-MM-DD (rechaza, por ejemplo, 2026-02-31). */
export function esFechaIsoValida(fechaIso: string): boolean {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaIso);
  if (!partes) return false;
  const [anio, mes, dia] = [Number(partes[1]), Number(partes[2]), Number(partes[3])];
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
}
