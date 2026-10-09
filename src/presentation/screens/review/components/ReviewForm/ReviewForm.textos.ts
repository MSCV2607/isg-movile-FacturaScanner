export const TEXTOS_REVISION = {
  deTuHistorial: 'De tu historial',
  cuitValido: 'CUIT válido',
  totalNoCierra: (suma: string, total: string) =>
    `Neto + IVA suman ${suma} y el total es ${total}. Revisá si falta algún importe.`,
} as const;
