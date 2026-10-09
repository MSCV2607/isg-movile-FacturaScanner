import { codificarBase64, textoABytesUtf8 } from '@core/utils/base64';
import { FilaReporte, reporteFilasMapper } from '@data/mappers/reporteFilasMapper';
import { ReportePeriodo } from '@domain/entities/ReportePeriodo';

import { ArchivoReporte, GeneradorReporteDataSource } from './GeneradorReporteDataSource';

// Separador ";" y coma decimal: es lo que espera Excel con la configuración regional de Argentina.
const SEPARADOR = ';';
const BOM_UTF8 = [0xef, 0xbb, 0xbf];
const ENCABEZADOS = [
  'Fecha',
  'Tipo',
  'Comprobante',
  'Razón social',
  'CUIT',
  'Condición fiscal',
  'Categoría',
  'Moneda',
  'Neto',
  'IVA',
  'Total',
];

const importe = (valor: number) => valor.toFixed(2).replace('.', ',');

function celda(texto: string): string {
  return /[;"\r\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

function lineaDe(fila: FilaReporte): string {
  return [
    fila.fecha,
    fila.tipo,
    fila.comprobante,
    fila.razonSocial,
    fila.cuit,
    fila.condicionFiscal,
    fila.categoria,
    fila.moneda,
    importe(fila.neto),
    importe(fila.iva),
    importe(fila.total),
  ]
    .map(celda)
    .join(SEPARADOR);
}

/** Texto plano, una línea por factura. Lo abre cualquier planilla o sistema contable. */
export class ReporteCsvDataSource implements GeneradorReporteDataSource {
  async generar(reporte: ReportePeriodo): Promise<ArchivoReporte> {
    const filas = reporteFilasMapper.toFilas(reporte.facturas);
    const texto = [ENCABEZADOS.join(SEPARADOR), ...filas.map(lineaDe)].join('\r\n') + '\r\n';

    return {
      nombre: `${reporte.nombreBase}.csv`,
      tipoMime: 'text/csv',
      base64: codificarBase64([...BOM_UTF8, ...textoABytesUtf8(texto)]),
    };
  }
}
