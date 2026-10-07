export type ResultadoConsulta = {
  hayNueva: boolean;
  id: string;
  publicadaEn: Date | null;
};

export interface ActualizacionesDataSource {
  /** Pregunta al servicio de actualizaciones si hay algo nuevo para esta versión de la app. */
  consultar(): Promise<ResultadoConsulta>;
  /** Descarga lo pendiente y reinicia la app. */
  descargarYReiniciar(): Promise<void>;
}
