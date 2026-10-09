import * as XLSX from 'xlsx';

import { ENCABEZADOS_LIBRO_IVA, libroIvaFilasMapper, PRIMERA_COLUMNA_IMPORTE_LIBRO_IVA } from '@data/mappers/libroIvaFilasMapper';
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
  'Medio de pago',
  'Notas',
];
const COLUMNAS_IMPORTE = ['I', 'J', 'K'];

/** Una hoja con una fila por factura y, al final, el total en pesos. */
export class ReporteExcelDataSource implements GeneradorReporteDataSource {
  async generar(reporte: ReportePeriodo): Promise<ArchivoReporte> {
    if (reporte.tipo === 'libroIva') return this.generarLibroIva(reporte);

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
      fila.medioPago,
      fila.notas,
    ]);
    const filaTotal = ['', '', '', '', '', '', '', 'Total en pesos', '', totales.iva, totales.total, '', ''];

    const hoja = XLSX.utils.aoa_to_sheet([ENCABEZADOS, ...cuerpo, filaTotal]);
    hoja['!cols'] = [12, 18, 20, 36, 16, 22, 16, 8, 14, 14, 14, 16, 30].map((wch) => ({ wch }));

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

  /** Libro IVA Compras: una fila por comprobante con neto e IVA separados por alícuota. */
  private generarLibroIva(reporte: ReportePeriodo): ArchivoReporte {
    const filas = reporte.lineasLibroIva.map((linea) => libroIvaFilasMapper.toFila(linea));
    const totales = libroIvaFilasMapper.totales(reporte.lineasLibroIva);
    const relleno = Array(PRIMERA_COLUMNA_IMPORTE_LIBRO_IVA - 1).fill('');

    const hoja = XLSX.utils.aoa_to_sheet([
      ENCABEZADOS_LIBRO_IVA,
      ...filas.map((fila) => [...fila.textos, ...fila.importes]),
      [...relleno, 'Total en pesos', ...totales],
    ]);
    hoja['!cols'] = [12, 18, 20, 36, 16, 22, 8, ...totales.map(() => 15)].map((wch) => ({ wch }));

    for (let fila = 2; fila <= filas.length + 2; fila++) {
      for (let columna = PRIMERA_COLUMNA_IMPORTE_LIBRO_IVA; columna < ENCABEZADOS_LIBRO_IVA.length; columna++) {
        const celda = hoja[XLSX.utils.encode_cell({ r: fila - 1, c: columna })];
        if (celda) celda.z = FORMATO_IMPORTE;
      }
    }

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Libro IVA Compras');
    return {
      nombre: `${reporte.nombreBase}.xlsx`,
      tipoMime: TIPO_MIME_EXCEL,
      base64: XLSX.write(libro, { type: 'base64', bookType: 'xlsx' }) as string,
    };
  }
}
