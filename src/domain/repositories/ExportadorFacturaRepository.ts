import { FacturaGuardada } from '../entities/FacturaGuardada';

/** Saca los datos de una factura guardada hacia afuera de la app. */
export interface ExportadorFacturaRepository {
  /** Genera el Excel y pide al usuario la carpeta donde guardarlo. false si canceló. */
  exportarExcel(factura: FacturaGuardada): Promise<boolean>;
  /** Copia las fotos originales a una carpeta que elige el usuario. Devuelve cuántas copió (0 si canceló). */
  descargarFotos(factura: FacturaGuardada): Promise<number>;
  /** Abre el menú del sistema para compartir el Excel con la app que el usuario elija. */
  compartirExcel(factura: FacturaGuardada): Promise<void>;
}
