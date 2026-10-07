import { FacturaGuardada } from '../entities/FacturaGuardada';
import { FacturaLocalRepository } from '../repositories/FacturaLocalRepository';

export class ObtenerFacturaGuardadaUseCase {
  constructor(private readonly facturas: FacturaLocalRepository) {}

  ejecutar(id: number): Promise<FacturaGuardada | null> {
    return this.facturas.obtener(id);
  }
}
