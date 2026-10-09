export const SIN_CATEGORIA = 'Sin categoría';

/** 'sin' = sin tope; 'ok' = dentro del tope; 'cerca' = usó el 80% o más; 'excedido' = lo superó. */
export type EstadoTope = 'sin' | 'ok' | 'cerca' | 'excedido';

export interface TotalPorCategoria {
  categoria: string;
  total: number;
  /** Porcentaje del total del período, entero. 0 si el total no es positivo. */
  porcentaje: number;
  /** Tope mensual del rubro, o null si no tiene. */
  tope: number | null;
  estadoTope: EstadoTope;
  /** Cuánto del tope se usó, entero (puede pasar de 100). 0 si no hay tope. */
  porcentajeDelTope: number;
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
