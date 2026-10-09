/** Filas de la base local (SQLite), con los nombres de las columnas. */
export interface FacturaFilaDto {
  id: number;
  /** Fecha y hora de guardado en ISO 8601. */
  creada_en: string;
  emisor_razon_social: string;
  emisor_cuit: string;
  emisor_condicion_fiscal: string;
  tipo_comprobante: string;
  letra: string;
  punto_venta: number;
  numero: number;
  /** AAAA-MM-DD */
  fecha_emision: string;
  moneda: string;
  importe_neto: number;
  importe_iva: number;
  importe_total: number;
  /** Rubro del gasto; texto vacío si no se eligió. */
  categoria: string;
}

export interface ItemFilaDto {
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  alicuota_iva: number | null;
  subtotal: number;
}

export interface FotoFilaDto {
  /** Ruta relativa a la carpeta de documentos de la app. */
  ruta: string;
}

/** Factura lista para insertar: la fila principal más sus ítems. */
export interface NuevaFacturaDto {
  fila: Omit<FacturaFilaDto, 'id'>;
  items: ItemFilaDto[];
}
