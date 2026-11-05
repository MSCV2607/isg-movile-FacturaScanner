export const TEXTOS_REVISION = {
  deTuHistorial: 'De tu historial',
  cuitValido: 'CUIT válido',
  lecturaDudosa: 'La IA no estaba segura de este dato. Comparalo con la factura.',
  totalNoCierra: (suma: string, total: string) =>
    `Neto + IVA suman ${suma} y el total es ${total}. Revisá si falta algún importe.`,
} as const;
