import { ResultadoRespaldo } from '../entities/Respaldo';
import { RespaldoRepository } from '../repositories/RespaldoRepository';

export class CrearRespaldoUseCase {
  constructor(private readonly respaldo: RespaldoRepository) {}

  ejecutar(): Promise<ResultadoRespaldo | null> {
    return this.respaldo.crear();
  }
}
