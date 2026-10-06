export interface Emisor {
  razonSocial: string;
  /** Solo dígitos (11 caracteres). */
  cuit: string;
  /** "Responsable Inscripto", "Monotributo", "Exento", ... */
  condicionFiscal: string;
}

export interface ItemFactura {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  /** Alícuota de IVA en porcentaje (21, 10.5, 0...). null si no figura. */
  alicuotaIva: number | null;
  subtotal: number;
}

/** Datos de una factura leídos de su foto. */
export interface Factura {
  emisor: Emisor;
  /** "Factura", "Nota de crédito", "Nota de débito", ... */
  tipoComprobante: string;
  /** "A", "B", "C", "M"... */
  letra: string;
  puntoVenta: number;
  numero: number;
  /** Fecha de emisión con formato AAAA-MM-DD. */
  fecha: string;
  /** Código ISO: 'ARS', 'USD'. */
  moneda: string;
  items: ItemFactura[];
  importeNeto: number;
  importeIva: number;
  importeTotal: number;
}

export type CampoFactura =
  | 'razonSocial'
  | 'cuitEmisor'
  | 'condicionFiscal'
  | 'puntoVenta'
  | 'numero'
  | 'fecha'
  | 'importeNeto'
  | 'importeIva'
  | 'importeTotal';

export type ErroresFactura = Partial<Record<CampoFactura, string>>;
