import { FacturaGuardada } from '../entities/FacturaGuardada';
import { ExportadorFacturaRepository } from '../repositories/ExportadorFacturaRepository';

/** Las formas de sacar una factura guardada de la app: Excel, fotos y menú de compartir. */
export class ExportarFacturaUseCase {
  constructor(private readonly exportador: ExportadorFacturaRepository) {}

  excel(factura: FacturaGuardada): Promise<boolean> {
    return this.exportador.exportarExcel(factura);
  }

  fotos(factura: FacturaGuardada): Promise<number> {
    return this.exportador.descargarFotos(factura);
  }

  compartir(factura: FacturaGuardada): Promise<void> {
    return this.exportador.compartirExcel(factura);
  }
}
