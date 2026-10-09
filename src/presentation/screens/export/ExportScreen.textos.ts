import { FormatoReporte, TipoReporte } from '@domain/entities/ReportePeriodo';

export const TEXTOS_EXPORTAR = {
  titulo: 'Exportar',
  subtitulo: 'Listado de facturas guardadas',
  periodo: 'Período',
  tipo: 'Tipo de reporte',
  libroIvaAyuda: 'Una fila por comprobante con neto e IVA separados por alícuota (21%, 10,5% y 27%), listo para pasarle al contador. Disponible en Excel y CSV.',
  formato: 'Formato',
  fotos: 'Incluir fotos',
  fotosAyuda: 'Las fotos se copian en una subcarpeta "Fotos", junto al listado. Hay que elegir una carpeta.',
  compartir: 'Generar y compartir',
  guardarEnCarpeta: 'Guardar en una carpeta',
  vacio: 'No hay facturas en este período.',
  resumen: (cantidad: number, total: string) => `${cantidad} ${cantidad === 1 ? 'factura' : 'facturas'} · ${total}`,
  otraMoneda: (cantidad: number) =>
    `${cantidad} ${cantidad === 1 ? 'factura está' : 'facturas están'} en otra moneda y no suman al total.`,
} as const;

export const FORMATOS: { valor: FormatoReporte; etiqueta: string }[] = [
  { valor: 'xlsx', etiqueta: 'Excel' },
  { valor: 'csv', etiqueta: 'CSV' },
  { valor: 'pdf', etiqueta: 'PDF' },
];

export const TIPOS: { valor: TipoReporte; etiqueta: string }[] = [
  { valor: 'listado', etiqueta: 'Listado' },
  { valor: 'libroIva', etiqueta: 'Libro IVA Compras' },
];
