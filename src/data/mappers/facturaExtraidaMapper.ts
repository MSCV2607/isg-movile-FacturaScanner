import { ErrorExtraccion } from '@core/errors/ErrorExtraccion';
import { parsearFechaALaIso, soloDigitos } from '@core/utils/parsers';
import { ExtraccionFactura } from '@domain/entities/ExtraccionFactura';
import { CampoFactura, Factura } from '@domain/entities/Factura';

import { FacturaExtraidaDto } from '../dtos/FacturaExtraidaDto';

const aNumero = (valor: unknown): number => {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : 0;
};

const aTexto = (valor: unknown): string => {
  if (typeof valor === 'string') return valor.trim();
  return typeof valor === 'number' && Number.isFinite(valor) ? String(valor) : '';
};

const CAMPO_POR_NOMBRE: Record<string, CampoFactura> = {
  razon_social: 'razonSocial',
  cuit: 'cuitEmisor',
  condicion_fiscal: 'condicionFiscal',
  punto_venta: 'puntoVenta',
  numero: 'numero',
  fecha: 'fecha',
  importe_neto: 'importeNeto',
  importe_iva: 'importeIva',
  importe_total: 'importeTotal',
};

function aCamposDudosos(valor: unknown): CampoFactura[] {
  if (!Array.isArray(valor)) return [];
  const campos = valor.map((nombre) => CAMPO_POR_NOMBRE[aTexto(nombre)]).filter((campo) => campo !== undefined);
  return [...new Set(campos)];
}

function normalizarFecha(fecha: unknown): string {
  const texto = aTexto(fecha);
  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) return texto;
  return parsearFechaALaIso(texto);
}

/** Normaliza lo que dijo la IA. Los datos dudosos quedan vacíos o en cero: se corrigen en la revisión. */
export function facturaExtraidaToEntity(dto: FacturaExtraidaDto): Factura {
  if (!dto.es_factura) {
    throw new ErrorExtraccion('No parece una factura. Probá con otra foto, bien encuadrada y con buena luz.');
  }

  return {
    emisor: {
      razonSocial: aTexto(dto.emisor_razon_social),
      cuit: soloDigitos(aTexto(dto.emisor_cuit)),
      condicionFiscal: aTexto(dto.emisor_condicion_fiscal),
    },
    tipoComprobante: aTexto(dto.tipo_comprobante) || 'Factura',
    letra: aTexto(dto.letra).toUpperCase().slice(0, 1),
    puntoVenta: aNumero(dto.punto_venta),
    numero: aNumero(dto.numero),
    fecha: normalizarFecha(dto.fecha_emision),
    moneda: aTexto(dto.moneda).toUpperCase() || 'ARS',
    items: (Array.isArray(dto.items) ? dto.items : []).map((item) => ({
      descripcion: aTexto(item.descripcion),
      cantidad: aNumero(item.cantidad),
      precioUnitario: aNumero(item.precio_unitario),
      alicuotaIva: item.alicuota_iva === null || item.alicuota_iva === undefined ? null : aNumero(item.alicuota_iva),
      subtotal: aNumero(item.subtotal),
    })),
    importeNeto: aNumero(dto.importe_neto),
    importeIva: aNumero(dto.importe_iva),
    importeTotal: aNumero(dto.importe_total),
    categoria: '',
    medioPago: '',
    notas: '',
  };
}

/** Igual que `facturaExtraidaToEntity`, más los datos de control que usa la validación de la lectura. */
export function facturaExtraidaToExtraccion(dto: FacturaExtraidaDto, proveedor: string): ExtraccionFactura {
  return {
    factura: facturaExtraidaToEntity(dto),
    cuitReceptor: soloDigitos(aTexto(dto.receptor_cuit)),
    otrosTributos: aNumero(dto.importe_otros_tributos),
    camposDudosos: aCamposDudosos(dto.campos_dudosos),
    proveedor,
  };
}
