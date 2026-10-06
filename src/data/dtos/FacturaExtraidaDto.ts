/** Lo que devuelve la IA al leer la foto (snake_case, valores sin normalizar). */
export interface FacturaExtraidaDto {
  es_factura: boolean;
  emisor_razon_social: string;
  emisor_cuit: string;
  emisor_condicion_fiscal: string;
  tipo_comprobante: string;
  letra: string;
  punto_venta: number | string;
  numero: number | string;
  fecha_emision: string;
  moneda: string;
  items: {
    descripcion: string;
    cantidad: number;
    precio_unitario: number;
    alicuota_iva: number | null;
    subtotal: number;
  }[];
  importe_neto: number;
  importe_iva: number;
  importe_total: number;
}
