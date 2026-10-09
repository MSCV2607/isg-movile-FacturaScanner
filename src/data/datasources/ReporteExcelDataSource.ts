import * as XLSX from 'xlsx';

import { reporteFilasMapper } from '@data/mappers/reporteFilasMapper';
import { ReportePeriodo } from '@domain/entities/ReportePeriodo';

import { ArchivoReporte, GeneradorReporteDataSource } from './GeneradorReporteDataSource';
import { TIPO_MIME_EXCEL } from './ExcelDataSource';

const FORMATO_IMPORTE = '#,##0.00';
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
const COLUMNAS_IMPORTE = ['I', 'J', 'K'];

/** Una hoja con una fila por factura y, al final, el total en pesos. */
export class ReporteExcelDataSource implements GeneradorReporteDataSource {
  async generar(reporte: ReportePeriodo): Promise<ArchivoReporte> {
    const filas = reporteFilasMapper.toFilas(reporte.facturas);
    const totales = reporteFilasMapper.totales(filas);

    const cuerpo = filas.map((fila) => [
      fila.fecha,
      fila.tipo,
      fila.comprobante,
      fila.razonSocial,
      fila.cuit,
      fila.condicionFiscal,
      fila.categoria,
      fila.moneda,
      fila.neto,
      fila.iva,
      fila.total,
    ]);
    const filaTotal = ['', '', '', '', '', '', '', 'Total en pesos', '', totales.iva, totales.total];

    const hoja = XLSX.utils.aoa_to_sheet([ENCABEZADOS, ...cuerpo, filaTotal]);
    hoja['!cols'] = [12, 18, 20, 36, 16, 22, 16, 8, 14, 14, 14].map((wch) => ({ wch }));

    for (let fila = 2; fila <= filas.length + 2; fila++) {
      for (const columna of COLUMNAS_IMPORTE) {
        const celda = hoja[`${columna}${fila}`];
        if (celda) celda.z = FORMATO_IMPORTE;
      }
    }

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Facturas');

    return {
      nombre: `${reporte.nombreBase}.xlsx`,
      tipoMime: TIPO_MIME_EXCEL,
      base64: XLSX.write(libro, { type: 'base64', bookType: 'xlsx' }) as string,
    };
  }
}
