/** Datos que trae el código QR de una factura electrónica de ARCA (ex AFIP). Son exactos. */
export interface DatosQrArca {
  /** 11 dígitos. */
  cuit: string;
  puntoVenta: number;
  numero: number;
  /** AAAA-MM-DD. */
  fecha: string;
  importeTotal: number;
  /** Código ISO ('ARS', 'USD'...). Vacío si el código de moneda del QR no se reconoce. */
  moneda: string;
  /** "Factura", "Nota de crédito"... Vacío si el tipo del QR no se reconoce. */
  tipoComprobante: string;
  /** "A", "B", "C", "M"... Vacío si el tipo del QR no se reconoce. */
  letra: string;
}
