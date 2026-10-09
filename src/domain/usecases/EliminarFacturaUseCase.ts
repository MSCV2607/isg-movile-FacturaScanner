import { FacturaLocalRepository } from '../repositories/FacturaLocalRepository';

/** Borra una factura guardada con sus fotos. */
export class EliminarFacturaUseCase {
  constructor(private readonly facturas: FacturaLocalRepository) {}

  ejecutar(id: number): Promise<void> {
    return this.facturas.eliminar(id);
  }
}
