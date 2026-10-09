/** Preferencias del usuario sobre cómo clasificar sus gastos. */
export interface Ajustes {
  /** Rubros que se pueden elegir al revisar una factura. */
  categorias: string[];
  /** Tope de gasto mensual (en pesos) por rubro. Un rubro sin tope no aparece acá. */
  topes: Record<string, number>;
}
