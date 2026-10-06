import { Factura } from '@domain/entities/Factura';

import { FacturaDto } from '../dtos/FacturaDto';

export function facturaToDto(factura: Factura): FacturaDto {
  return {
    emisor: {
      razon_social: factura.emisor.razonSocial,
      cuit: factura.emisor.cuit,
      condicion_fiscal: factura.emisor.condicionFiscal,
    },
    comprobante: {
      tipo: factura.tipoComprobante,
      letra: factura.letra,
      punto_venta: factura.puntoVenta,
      numero: factura.numero,
      fecha: factura.fecha,
    },
    moneda: factura.moneda,
    items: factura.items.map((item) => ({
      descripcion: item.descripcion,
      cantidad: item.cantidad,
      precio_unitario: item.precioUnitario,
      alicuota_iva: item.alicuotaIva,
      subtotal: item.subtotal,
    })),
    importes: {
      neto: factura.importeNeto,
      iva: factura.importeIva,
      total: factura.importeTotal,
    },
  };
}
