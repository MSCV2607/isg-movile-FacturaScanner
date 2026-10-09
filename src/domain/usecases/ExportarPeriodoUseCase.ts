import { FormatoReporte, FotosDeFactura, ReportePeriodo, ResultadoGuardadoReporte } from '../entities/ReportePeriodo';
import { ResumenFactura } from '../entities/ResumenFactura';
import { etiquetaDeArchivo } from '../rules/comprobante';
import { ExportadorReporteRepository } from '../repositories/ExportadorReporteRepository';
import { FacturaLocalRepository } from '../repositories/FacturaLocalRepository';
import { Periodo, etiquetaDelPeriodo, sufijoDelPeriodo } from '../rules/periodos';

/** Arma el listado de un período y lo comparte, o lo guarda en una carpeta con las fotos si se piden. */
export class ExportarPeriodoUseCase {
  constructor(
    private readonly exportador: ExportadorReporteRepository,
    private readonly facturas: FacturaLocalRepository,
  ) {}

  armarReporte(periodo: Periodo, facturas: ResumenFactura[], hoy: Date = new Date()): ReportePeriodo {
    return {
      titulo: `Facturas · ${etiquetaDelPeriodo(periodo, hoy)}`,
      nombreBase: `Facturas_${sufijoDelPeriodo(periodo, hoy)}`,
      facturas,
    };
  }

  compartir(reporte: ReportePeriodo, formato: FormatoReporte): Promise<void> {
    return this.exportador.compartir(reporte, formato);
  }

  async guardar(reporte: ReportePeriodo, formato: FormatoReporte, conFotos: boolean): Promise<ResultadoGuardadoReporte> {
    const fotos = conFotos ? await this.cargarFotos(reporte.facturas) : [];
    return this.exportador.guardarEnCarpeta(reporte, formato, fotos);
  }

  private async cargarFotos(facturas: ResumenFactura[]): Promise<FotosDeFactura[]> {
    const fotos: FotosDeFactura[] = [];
    for (const resumen of facturas) {
      const guardada = await this.facturas.obtener(resumen.id);
      if (!guardada || guardada.fotos.length === 0) continue;
      fotos.push({
        etiqueta: etiquetaDeArchivo(resumen),
        uris: guardada.fotos,
      });
    }
    return fotos;
  }
}
