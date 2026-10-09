import { ReportePeriodo } from '@domain/entities/ReportePeriodo';

export interface ArchivoReporte {
  /** Con extensión: "Facturas_2026-10.xlsx". */
  nombre: string;
  tipoMime: string;
  /** Contenido del archivo codificado en base64. */
  base64: string;
}

/** Arma el archivo de un listado de facturas en un formato (Excel, CSV o PDF). */
export interface GeneradorReporteDataSource {
  generar(reporte: ReportePeriodo): Promise<ArchivoReporte>;
}
