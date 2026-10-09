export const SIN_CATEGORIA = 'Sin categoría';

export interface TotalPorCategoria {
  categoria: string;
  total: number;
  /** Porcentaje del total del período, entero. 0 si el total no es positivo. */
  porcentaje: number;
}

export interface TotalPorProveedor {
  razonSocial: string;
  cuit: string;
  total: number;
}

/** Cuánto se gastó en un período y en qué (solo facturas en pesos; las notas de crédito restan). */
export interface ResumenPeriodo {
  cantidad: number;
  total: number;
  iva: number;
  categorias: TotalPorCategoria[];
  proveedores: TotalPorProveedor[];
  /** Facturas en otra moneda: no se suman al resumen. */
  cantidadOtraMoneda: number;
}
