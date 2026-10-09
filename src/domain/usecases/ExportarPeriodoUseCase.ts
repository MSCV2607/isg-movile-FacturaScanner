import { LineaLibroIva } from '../entities/LibroIva';
import {
  FormatoReporte,
  FotosDeFactura,
  ReportePeriodo,
  ResultadoGuardadoReporte,
  TipoReporte,
} from '../entities/ReportePeriodo';
import { ResumenFactura } from '../entities/ResumenFactura';
import { ExportadorReporteRepository } from '../repositories/ExportadorReporteRepository';
import { FacturaLocalRepository } from '../repositories/FacturaLocalRepository';
import { etiquetaDeArchivo } from '../rules/comprobante';
import { desglosarIva } from '../rules/iva';
import { Periodo, etiquetaDelPeriodo, sufijoDelPeriodo } from '../rules/periodos';

/** Arma el listado de un período y lo comparte, o lo guarda en una carpeta con las fotos si se piden. */
export class ExportarPeriodoUseCase {
  constructor(
    private readonly exportador: ExportadorReporteRepository,
    private readonly facturas: FacturaLocalRepository,
  ) {}

  async armarReporte(
    periodo: Periodo,
    facturas: ResumenFactura[],
    tipo: TipoReporte = 'listado',
    hoy: Date = new Date(),
  ): Promise<ReportePeriodo> {
    const etiqueta = etiquetaDelPeriodo(periodo, hoy);
    const sufijo = sufijoDelPeriodo(periodo, hoy);

    if (tipo === 'libroIva') {
      return {
        tipo,
        titulo: `Libro IVA Compras · ${etiqueta}`,
        nombreBase: `LibroIVA_Compras_${sufijo}`,
        facturas,
        lineasLibroIva: await this.armarLibroIva(facturas),
      };
    }
    return { tipo, titulo: `Facturas · ${etiqueta}`, nombreBase: `Facturas_${sufijo}`, facturas, lineasLibroIva: [] };
  }

  compartir(reporte: ReportePeriodo, formato: FormatoReporte): Promise<void> {
    return this.exportador.compartir(reporte, formato);
  }

  async guardar(reporte: ReportePeriodo, formato: FormatoReporte, conFotos: boolean): Promise<ResultadoGuardadoReporte> {
    const fotos = conFotos ? await this.cargarFotos(reporte.facturas) : [];
    return this.exportador.guardarEnCarpeta(reporte, formato, fotos);
  }

  /** El desglose por alícuota sale de los ítems, que el listado resumido no trae: se lee cada factura completa. */
  private async armarLibroIva(facturas: ResumenFactura[]): Promise<LineaLibroIva[]> {
    const lineas: LineaLibroIva[] = [];
    for (const resumen of facturas) {
      const guardada = await this.facturas.obtener(resumen.id);
      if (!guardada) continue;
      const { factura } = guardada;
      lineas.push({
        fecha: factura.fecha,
        tipoComprobante: factura.tipoComprobante,
        comprobante: `${factura.letra} ${String(factura.puntoVenta).padStart(4, '0')}-${String(factura.numero).padStart(8, '0')}`,
        razonSocial: factura.emisor.razonSocial,
        cuit: factura.emisor.cuit,
        condicionFiscal: factura.emisor.condicionFiscal,
        moneda: factura.moneda,
        desglose: desglosarIva(factura),
      });
    }
    return lineas;
  }

  private async cargarFotos(facturas: ResumenFactura[]): Promise<FotosDeFactura[]> {
    const fotos: FotosDeFactura[] = [];
    for (const resumen of facturas) {
      const guardada = await this.facturas.obtener(resumen.id);
      if (!guardada || guardada.fotos.length === 0) continue;
      fotos.push({ etiqueta: etiquetaDeArchivo(resumen), uris: guardada.fotos });
    }
    return fotos;
  }
}
