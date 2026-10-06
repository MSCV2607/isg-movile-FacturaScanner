/** Forma del envío tal como la entrega la fuente de datos (no es la entidad del dominio). */
export interface EnvioDto {
  id: string;
  letra: string;
  punto_venta: number;
  numero: number;
  cuit_emisor: string;
  /** Fecha en formato AAAA-MM-DD. */
  fecha: string;
  importe: number;
  estado: string;
}
