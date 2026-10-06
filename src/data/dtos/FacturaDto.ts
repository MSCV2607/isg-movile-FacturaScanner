/** JSON que recibe el endpoint (snake_case). */
export interface FacturaDto {
  emisor: {
    razon_social: string;
    cuit: string;
    condicion_fiscal: string;
  };
  comprobante: {
    tipo: string;
    letra: string;
    punto_venta: number;
    numero: number;
    fecha: string;
  };
  moneda: string;
  items: {
    descripcion: string;
    cantidad: number;
    precio_unitario: number;
    alicuota_iva: number | null;
    subtotal: number;
  }[];
  importes: {
    neto: number;
    iva: number;
    total: number;
  };
}
