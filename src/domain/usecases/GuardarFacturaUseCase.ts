import { Factura } from '../entities/Factura';
import { FacturaGuardada } from '../entities/FacturaGuardada';
import { ImagenFactura } from '../entities/ImagenFactura';
import { FacturaLocalRepository } from '../repositories/FacturaLocalRepository';

/** Guarda en el celular la factura revisada por el usuario, junto con sus fotos. */
export class GuardarFacturaUseCase {
  constructor(private readonly facturas: FacturaLocalRepository) {}

  ejecutar(factura: Factura, fotos: ImagenFactura[]): Promise<FacturaGuardada> {
    return this.facturas.guardar(factura, fotos);
  }
}
