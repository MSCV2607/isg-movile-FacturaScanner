import { Factura } from '../entities/Factura';
import { FacturaLocalRepository } from '../repositories/FacturaLocalRepository';

/** Guarda las correcciones que el usuario hizo a una factura ya guardada. */
export class ActualizarFacturaUseCase {
  constructor(private readonly facturas: FacturaLocalRepository) {}

  ejecutar(id: number, factura: Factura): Promise<void> {
    return this.facturas.actualizar(id, factura);
  }
}
