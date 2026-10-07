import { ResumenFactura } from '../entities/ResumenFactura';
import { FacturaLocalRepository } from '../repositories/FacturaLocalRepository';

const CANTIDAD_POR_DEFECTO = 10;

export class ObtenerUltimasFacturasUseCase {
  constructor(private readonly facturas: FacturaLocalRepository) {}

  ejecutar(cantidad: number = CANTIDAD_POR_DEFECTO): Promise<ResumenFactura[]> {
    return this.facturas.obtenerUltimas(cantidad);
  }
}
