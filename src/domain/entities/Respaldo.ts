export interface ResultadoRespaldo {
  facturas: number;
  fotos: number;
}

export interface ResultadoRestauracion {
  /** Facturas que se agregaron. */
  restauradas: number;
  /** Facturas que ya estaban guardadas en este celular y se dejaron como estaban. */
  repetidas: number;
  /** Entradas del respaldo con datos inválidos o ilegibles. */
  omitidas: number;
}
