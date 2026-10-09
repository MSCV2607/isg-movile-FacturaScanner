import { FormatoReporte, FotosDeFactura, ReportePeriodo, ResultadoGuardadoReporte } from '../entities/ReportePeriodo';

/** Saca el listado de facturas de un período hacia afuera de la app. */
export interface ExportadorReporteRepository {
  /** Genera el archivo y abre el menú del sistema para compartirlo. */
  compartir(reporte: ReportePeriodo, formato: FormatoReporte): Promise<void>;
  /**
   * Pide una carpeta, guarda ahí el archivo y, si hay fotos, las copia en una subcarpeta "Fotos".
   * Si el usuario cancela la elección de carpeta no se guarda nada.
   */
  guardarEnCarpeta(
    reporte: ReportePeriodo,
    formato: FormatoReporte,
    fotos: FotosDeFactura[],
  ): Promise<ResultadoGuardadoReporte>;
}
