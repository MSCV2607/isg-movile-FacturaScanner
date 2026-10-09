/** Neto e IVA de un comprobante repartidos por alícuota, como lo pide el Libro IVA Compras. */
export interface DesgloseIva {
  neto21: number;
  neto105: number;
  neto27: number;
  /** Neto con una alícuota que no es 21, 10,5 ni 27 (por ejemplo 5% o 2,5%). */
  netoOtras: number;
  /** Neto sin IVA: exento, no gravado o de un emisor que no discrimina IVA (factura C). */
  noGravado: number;
  iva21: number;
  iva105: number;
  iva27: number;
  ivaOtras: number;
  /** Lo que falta para llegar al total: percepciones, impuestos internos, redondeos. */
  otrosConceptos: number;
  total: number;
}

export interface LineaLibroIva {
  fecha: string;
  tipoComprobante: string;
  comprobante: string;
  razonSocial: string;
  cuit: string;
  condicionFiscal: string;
  moneda: string;
  /** Importes con el signo del comprobante (las notas de crédito son negativas). */
  desglose: DesgloseIva;
}
