import * as XLSX from 'xlsx';

import {
  completarNumero,
  completarPuntoVenta,
  formatearCuit,
  formatearFechaIso,
} from '@core/utils/formatters';
import { FacturaGuardada } from '@domain/entities/FacturaGuardada';

export const TIPO_MIME_EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const FORMATO_IMPORTE = '#,##0.00';

export interface ArchivoExcel {
  nombre: string;
  /** Contenido del .xlsx codificado en base64. */
  base64: string;
}

/** Arma el archivo Excel de una factura: una hoja con sus datos y otra con los ítems. */
export class ExcelDataSource {
  generar({ factura }: FacturaGuardada): ArchivoExcel {
    const comprobante = `${completarPuntoVenta(factura.puntoVenta)}-${completarNumero(factura.numero)}`;

    const datos = XLSX.utils.aoa_to_sheet([
      ['Campo', 'Valor'],
      ['Razón social', factura.emisor.razonSocial],
      ['CUIT', formatearCuit(factura.emisor.cuit)],
      ['Condición fiscal', factura.emisor.condicionFiscal],
      ['Tipo de comprobante', `${factura.tipoComprobante} ${factura.letra}`.trim()],
      ['Punto de venta', factura.puntoVenta],
      ['Número', factura.numero],
      ['Comprobante', comprobante],
      ['Fecha de emisión', formatearFechaIso(factura.fecha)],
      ['Moneda', factura.moneda],
      ['Neto', factura.importeNeto],
      ['IVA', factura.importeIva],
      ['Total', factura.importeTotal],
    ]);
    datos['!cols'] = [{ wch: 22 }, { wch: 38 }];
    this.darFormatoImporte(datos, ['B11', 'B12', 'B13']);

    const filasItems = factura.items.map((item) => [
      item.descripcion,
      item.cantidad,
      item.precioUnitario,
      item.alicuotaIva ?? '',
      item.subtotal,
    ]);
    const items = XLSX.utils.aoa_to_sheet([
      ['Descripción', 'Cantidad', 'Precio unitario', 'Alícuota IVA (%)', 'Subtotal'],
      ...filasItems,
    ]);
    items['!cols'] = [{ wch: 40 }, { wch: 10 }, { wch: 16 }, { wch: 16 }, { wch: 16 }];
    this.darFormatoImporte(
      items,
      factura.items.flatMap((_, indice) => [`C${indice + 2}`, `E${indice + 2}`]),
    );

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, datos, 'Factura');
    XLSX.utils.book_append_sheet(libro, items, 'Ítems');

    return {
      nombre: `Factura_${factura.letra}_${comprobante}_${factura.emisor.cuit}.xlsx`,
      base64: XLSX.write(libro, { type: 'base64', bookType: 'xlsx' }) as string,
    };
  }

  private darFormatoImporte(hoja: XLSX.WorkSheet, celdas: string[]): void {
    for (const celda of celdas) {
      if (hoja[celda]) hoja[celda].z = FORMATO_IMPORTE;
    }
  }
}
