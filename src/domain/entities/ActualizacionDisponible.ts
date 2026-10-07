/** Una actualización de la app ya publicada y todavía no instalada. */
export type ActualizacionDisponible = {
  /** Identificador de la publicación. */
  id: string;
  /** Cuándo se publicó (null si no se sabe). */
  publicadaEn: Date | null;
};
