/** Datos mínimos de una factura guardada para listarla en el historial. */
export interface ResumenFactura {
  id: number;
  letra: string;
  puntoVenta: number;
  numero: number;
  razonSocial: string;
  /** CUIT del emisor, solo dígitos. */
  cuitEmisor: string;
  /** Fecha de emisión con formato AAAA-MM-DD. */
  fecha: string;
  importe: number;
  creadaEn: Date;
}
