export type EstadoEnvio = 'enviada' | 'error';

export type LetraComprobante = 'A' | 'B' | 'C' | 'M';

/** Una factura que se escaneó y se intentó enviar al servidor. */
export interface Envio {
  id: string;
  letra: LetraComprobante;
  puntoVenta: number;
  numero: number;
  /** CUIT del emisor, solo dígitos (11 caracteres). */
  cuitEmisor: string;
  fecha: Date;
  importe: number;
  estado: EstadoEnvio;
}
