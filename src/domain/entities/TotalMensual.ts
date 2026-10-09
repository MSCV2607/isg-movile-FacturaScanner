/** Lo gastado en pesos durante un mes (las notas de crédito restan). */
export interface TotalMensual {
  anio: number;
  /** 0 = enero, 11 = diciembre. */
  mes: number;
  total: number;
}
