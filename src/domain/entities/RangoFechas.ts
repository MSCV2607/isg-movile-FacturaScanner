/** Rango de fechas de emisión, con formato AAAA-MM-DD en ambos extremos incluidos. null = sin límite. */
export interface RangoFechas {
  desde: string | null;
  hasta: string | null;
}
