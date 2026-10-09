import { FacturaRespaldoDto } from '@data/dtos/RespaldoDto';
import { Factura } from '@domain/entities/Factura';

const esObjeto = (valor: unknown): valor is Record<string, unknown> => typeof valor === 'object' && valor !== null;
const aTexto = (valor: unknown): string => (typeof valor === 'string' ? valor.trim() : '');
const aNumero = (valor: unknown): number => (typeof valor === 'number' && Number.isFinite(valor) ? valor : 0);

export interface FacturaRestaurada {
  factura: Factura;
  creadaEn: Date;
  /** Nombres de las fotos dentro del respaldo. */
  fotos: string[];
}

export const respaldoMapper = {
  toDto(factura: Factura, creadaEn: Date, fotos: string[]): FacturaRespaldoDto {
    return {
      creadaEn: creadaEn.toISOString(),
      emisor: { ...factura.emisor },
      tipoComprobante: factura.tipoComprobante,
      letra: factura.letra,
      puntoVenta: factura.puntoVenta,
      numero: factura.numero,
      fecha: factura.fecha,
      moneda: factura.moneda,
      items: factura.items.map((item) => ({ ...item })),
      importeNeto: factura.importeNeto,
      importeIva: factura.importeIva,
      importeTotal: factura.importeTotal,
      categoria: factura.categoria,
      medioPago: factura.medioPago,
      notas: factura.notas,
      fotos,
    };
  },

  /**
   * Convierte una entrada del archivo de respaldo en una factura. Devuelve null si no tiene lo mínimo
   * (CUIT de 11 dígitos, punto de venta, número, fecha e importe): un respaldo editado a mano o dañado
   * no debe meter basura en la base.
   */
  toEntity(crudo: unknown): FacturaRestaurada | null {
    if (!esObjeto(crudo) || !esObjeto(crudo.emisor)) return null;

    const cuit = aTexto(crudo.emisor.cuit);
    const puntoVenta = aNumero(crudo.puntoVenta);
    const numero = aNumero(crudo.numero);
    const fecha = aTexto(crudo.fecha);
    const importeTotal = aNumero(crudo.importeTotal);

    if (!/^\d{11}$/.test(cuit)) return null;
    if (!Number.isInteger(puntoVenta) || puntoVenta < 1 || !Number.isInteger(numero) || numero < 1) return null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || importeTotal <= 0) return null;

    const creadaEn = new Date(aTexto(crudo.creadaEn));

    return {
      creadaEn: Number.isNaN(creadaEn.getTime()) ? new Date() : creadaEn,
      fotos: Array.isArray(crudo.fotos) ? crudo.fotos.filter((foto): foto is string => typeof foto === 'string') : [],
      factura: {
        emisor: {
          razonSocial: aTexto(crudo.emisor.razonSocial),
          cuit,
          condicionFiscal: aTexto(crudo.emisor.condicionFiscal),
        },
        tipoComprobante: aTexto(crudo.tipoComprobante) || 'Factura',
        letra: aTexto(crudo.letra).toUpperCase().slice(0, 1),
        puntoVenta,
        numero,
        fecha,
        moneda: aTexto(crudo.moneda).toUpperCase() || 'ARS',
        items: (Array.isArray(crudo.items) ? crudo.items : []).filter(esObjeto).map((item) => ({
          descripcion: aTexto(item.descripcion),
          cantidad: aNumero(item.cantidad),
          precioUnitario: aNumero(item.precioUnitario),
          alicuotaIva: item.alicuotaIva === null || item.alicuotaIva === undefined ? null : aNumero(item.alicuotaIva),
          subtotal: aNumero(item.subtotal),
        })),
        importeNeto: aNumero(crudo.importeNeto),
        importeIva: aNumero(crudo.importeIva),
        importeTotal,
        categoria: aTexto(crudo.categoria),
        medioPago: aTexto(crudo.medioPago),
        notas: typeof crudo.notas === 'string' ? crudo.notas : '',
      },
    };
  },
};
