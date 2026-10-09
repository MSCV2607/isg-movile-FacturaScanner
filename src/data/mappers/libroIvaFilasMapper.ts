import { formatearCuit, formatearFechaIso } from '@core/utils/formatters';
import { DesgloseIva, LineaLibroIva } from '@domain/entities/LibroIva';
import { redondear2 } from '@domain/rules/comprobante';

export const ENCABEZADOS_LIBRO_IVA = [
  'Fecha',
  'Tipo',
  'Comprobante',
  'Razón social',
  'CUIT',
  'Condición fiscal',
  'Moneda',
  'Neto 21%',
  'IVA 21%',
  'Neto 10,5%',
  'IVA 10,5%',
  'Neto 27%',
  'IVA 27%',
  'Neto otras alícuotas',
  'IVA otras alícuotas',
  'No gravado / exento',
  'Otros conceptos',
  'Total',
];

/** Posición (desde 0) de las columnas de importe, para darles formato numérico. */
export const PRIMERA_COLUMNA_IMPORTE_LIBRO_IVA = 7;

const IMPORTES: (keyof DesgloseIva)[] = [
  'neto21', 'iva21', 'neto105', 'iva105', 'neto27', 'iva27', 'netoOtras', 'ivaOtras', 'noGravado', 'otrosConceptos', 'total',
];

export const libroIvaFilasMapper = {
  /** Textos de cada línea (hasta la moneda) seguidos de los importes en el orden de los encabezados. */
  toFila(linea: LineaLibroIva): { textos: string[]; importes: number[] } {
    return {
      textos: [
        formatearFechaIso(linea.fecha),
        linea.tipoComprobante,
        linea.comprobante,
        linea.razonSocial,
        formatearCuit(linea.cuit),
        linea.condicionFiscal,
        linea.moneda,
      ],
      importes: IMPORTES.map((clave) => linea.desglose[clave]),
    };
  },

  /** Totales de las líneas en pesos, en el mismo orden que los importes. */
  totales(lineas: LineaLibroIva[]): number[] {
    const enPesos = lineas.filter((linea) => linea.moneda === 'ARS');
    return IMPORTES.map((clave) => redondear2(enPesos.reduce((suma, linea) => suma + linea.desglose[clave], 0)));
  },
};
