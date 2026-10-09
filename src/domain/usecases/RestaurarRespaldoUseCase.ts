import { ResultadoRestauracion } from '../entities/Respaldo';
import { RespaldoRepository } from '../repositories/RespaldoRepository';

export class RestaurarRespaldoUseCase {
  constructor(private readonly respaldo: RespaldoRepository) {}

  ejecutar(): Promise<ResultadoRestauracion | null> {
    return this.respaldo.restaurar();
  }
}
