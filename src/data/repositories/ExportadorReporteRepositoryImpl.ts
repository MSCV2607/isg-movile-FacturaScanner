import { FormatoReporte, FotosDeFactura, ReportePeriodo, ResultadoGuardadoReporte } from '@domain/entities/ReportePeriodo';
import { ExportadorReporteRepository } from '@domain/repositories/ExportadorReporteRepository';

import { ArchivosDataSource } from '../datasources/ArchivosDataSource';
import { GeneradorReporteDataSource } from '../datasources/GeneradorReporteDataSource';

const CARPETA_FOTOS = 'Fotos';

export class ExportadorReporteRepositoryImpl implements ExportadorReporteRepository {
  constructor(
    private readonly generadores: Record<FormatoReporte, GeneradorReporteDataSource>,
    private readonly archivos: ArchivosDataSource,
  ) {}

  async compartir(reporte: ReportePeriodo, formato: FormatoReporte): Promise<void> {
    const archivo = await this.generadores[formato].generar(reporte);
    const uri = this.archivos.guardarTemporal(archivo.nombre, archivo.base64);
    await this.archivos.compartir(uri, archivo.tipoMime, 'Compartir listado de facturas');
  }

  async guardarEnCarpeta(
    reporte: ReportePeriodo,
    formato: FormatoReporte,
    fotos: FotosDeFactura[],
  ): Promise<ResultadoGuardadoReporte> {
    const carpeta = await this.archivos.elegirCarpeta();
    if (!carpeta) return { guardado: false, fotosCopiadas: 0 };

    const archivo = await this.generadores[formato].generar(reporte);
    this.archivos.guardarBase64EnCarpeta(carpeta, archivo.nombre, archivo.tipoMime, archivo.base64);

    let fotosCopiadas = 0;
    if (fotos.length > 0) {
      const carpetaFotos = this.archivos.crearSubcarpeta(carpeta, CARPETA_FOTOS);
      for (const factura of fotos) {
        for (const [indice, uri] of factura.uris.entries()) {
          const png = uri.toLowerCase().endsWith('.png');
          await this.archivos.copiarACarpeta(
            carpetaFotos,
            uri,
            `${factura.etiqueta}_foto${indice + 1}.${png ? 'png' : 'jpg'}`,
            png ? 'image/png' : 'image/jpeg',
          );
          fotosCopiadas += 1;
        }
      }
    }
    return { guardado: true, fotosCopiadas };
  }
}
