/** Datos mínimos de una factura guardada para listarla, buscarla y resumirla. */
export interface ResumenFactura {
  id: number;
  tipoComprobante: string;
  letra: string;
  puntoVenta: number;
  numero: number;
  razonSocial: string;
  /** CUIT del emisor, solo dígitos. */
  cuitEmisor: string;
  condicionFiscal: string;
  /** Fecha de emisión con formato AAAA-MM-DD. */
  fecha: string;
  /** Código ISO: 'ARS', 'USD'. */
  moneda: string;
  importeNeto: number;
  importeIva: number;
  /** Importe total de la factura. */
  importe: number;
  /** Rubro del gasto. Vacío si no se eligió ninguno. */
  categoria: string;
  creadaEn: Date;
}
