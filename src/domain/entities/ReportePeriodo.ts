import { ResumenFactura } from './ResumenFactura';

export type FormatoReporte = 'xlsx' | 'csv' | 'pdf';

/** Listado de facturas de un período, listo para exportar. */
export interface ReportePeriodo {
  /** Encabezado del listado ("Facturas · Octubre 2026"). */
  titulo: string;
  /** Nombre del archivo sin extensión. */
  nombreBase: string;
  facturas: ResumenFactura[];
}

/** Fotos originales de una factura, para copiarlas junto con el listado. */
export interface FotosDeFactura {
  /** Cómo nombrar los archivos ("A_0004-00001234"). */
  etiqueta: string;
  uris: string[];
}

export interface ResultadoGuardadoReporte {
  /** false si el usuario canceló la elección de carpeta. */
  guardado: boolean;
  fotosCopiadas: number;
}
