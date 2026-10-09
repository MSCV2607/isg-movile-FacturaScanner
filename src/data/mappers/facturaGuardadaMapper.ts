import { FacturaFilaDto, ItemFilaDto, NuevaFacturaDto } from '@data/dtos/FacturaGuardadaDto';
import { EmisorConocido } from '@domain/entities/EmisorConocido';
import { Factura } from '@domain/entities/Factura';
import { FacturaGuardada } from '@domain/entities/FacturaGuardada';
import { ResumenFactura } from '@domain/entities/ResumenFactura';

export const facturaGuardadaMapper = {
  toNuevaDto(factura: Factura, creadaEn: Date): NuevaFacturaDto {
    return {
      fila: {
        creada_en: creadaEn.toISOString(),
        emisor_razon_social: factura.emisor.razonSocial,
        emisor_cuit: factura.emisor.cuit,
        emisor_condicion_fiscal: factura.emisor.condicionFiscal,
        tipo_comprobante: factura.tipoComprobante,
        letra: factura.letra,
        punto_venta: factura.puntoVenta,
        numero: factura.numero,
        fecha_emision: factura.fecha,
        moneda: factura.moneda,
        importe_neto: factura.importeNeto,
        importe_iva: factura.importeIva,
        importe_total: factura.importeTotal,
        categoria: factura.categoria,
        medio_pago: factura.medioPago,
        notas: factura.notas,
      },
      items: factura.items.map((item) => ({
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        precio_unitario: item.precioUnitario,
        alicuota_iva: item.alicuotaIva,
        subtotal: item.subtotal,
      })),
    };
  },

  toEntity(fila: FacturaFilaDto, items: ItemFilaDto[], fotos: string[]): FacturaGuardada {
    return {
      id: fila.id,
      creadaEn: new Date(fila.creada_en),
      fotos,
      factura: {
        emisor: {
          razonSocial: fila.emisor_razon_social,
          cuit: fila.emisor_cuit,
          condicionFiscal: fila.emisor_condicion_fiscal,
        },
        tipoComprobante: fila.tipo_comprobante,
        letra: fila.letra,
        puntoVenta: fila.punto_venta,
        numero: fila.numero,
        fecha: fila.fecha_emision,
        moneda: fila.moneda,
        items: items.map((item) => ({
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          precioUnitario: item.precio_unitario,
          alicuotaIva: item.alicuota_iva,
          subtotal: item.subtotal,
        })),
        importeNeto: fila.importe_neto,
        importeIva: fila.importe_iva,
        importeTotal: fila.importe_total,
        categoria: fila.categoria,
        medioPago: fila.medio_pago,
        notas: fila.notas,
      },
    };
  },

  toEmisorConocido(fila: FacturaFilaDto): EmisorConocido {
    return {
      razonSocial: fila.emisor_razon_social,
      condicionFiscal: fila.emisor_condicion_fiscal,
      categoria: fila.categoria,
    };
  },

  toResumen(fila: FacturaFilaDto): ResumenFactura {
    return {
      id: fila.id,
      tipoComprobante: fila.tipo_comprobante,
      letra: fila.letra,
      puntoVenta: fila.punto_venta,
      numero: fila.numero,
      razonSocial: fila.emisor_razon_social,
      cuitEmisor: fila.emisor_cuit,
      condicionFiscal: fila.emisor_condicion_fiscal,
      fecha: fila.fecha_emision,
      moneda: fila.moneda,
      importeNeto: fila.importe_neto,
      importeIva: fila.importe_iva,
      importe: fila.importe_total,
      categoria: fila.categoria,
      medioPago: fila.medio_pago,
      notas: fila.notas,
      creadaEn: new Date(fila.creada_en),
    };
  },
};
