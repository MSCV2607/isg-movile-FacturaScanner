import { formatearComprobante, formatearCuit, formatearFechaIso } from '@core/utils/formatters';
import { ResumenFactura } from '@domain/entities/ResumenFactura';
import { importeConSigno, redondear2 } from '@domain/rules/comprobante';

/** Una factura del listado ya preparada para escribirse en cualquier formato (importes con su signo). */
export interface FilaReporte {
  fecha: string;
  tipo: string;
  comprobante: string;
  razonSocial: string;
  cuit: string;
  condicionFiscal: string;
  categoria: string;
  moneda: string;
  neto: number;
  iva: number;
  total: number;
}

export interface TotalesReporte {
  /** Suma de las facturas en pesos, con las notas de crédito restando. */
  total: number;
  iva: number;
  cantidadOtraMoneda: number;
}

export const reporteFilasMapper = {
  toFilas(facturas: ResumenFactura[]): FilaReporte[] {
    return facturas.map((factura) => ({
      fecha: formatearFechaIso(factura.fecha),
      tipo: factura.tipoComprobante,
      comprobante: formatearComprobante(factura.letra, factura.puntoVenta, factura.numero),
      razonSocial: factura.razonSocial,
      cuit: formatearCuit(factura.cuitEmisor),
      condicionFiscal: factura.condicionFiscal,
      categoria: factura.categoria,
      moneda: factura.moneda,
      neto: importeConSigno(factura.tipoComprobante, factura.importeNeto),
      iva: importeConSigno(factura.tipoComprobante, factura.importeIva),
      total: importeConSigno(factura.tipoComprobante, factura.importe),
    }));
  },

  totales(filas: FilaReporte[]): TotalesReporte {
    const enPesos = filas.filter((fila) => fila.moneda === 'ARS');
    return {
      total: redondear2(enPesos.reduce((suma, fila) => suma + fila.total, 0)),
      iva: redondear2(enPesos.reduce((suma, fila) => suma + fila.iva, 0)),
      cantidadOtraMoneda: filas.length - enPesos.length,
    };
  },
};
