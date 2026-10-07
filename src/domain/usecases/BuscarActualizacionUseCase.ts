import { ActualizacionDisponible } from '../entities/ActualizacionDisponible';
import { ActualizacionRepository } from '../repositories/ActualizacionRepository';

/** Consulta si hay una actualización publicada que la app todavía no tiene. */
export class BuscarActualizacionUseCase {
  constructor(private readonly repository: ActualizacionRepository) {}

  ejecutar(): Promise<ActualizacionDisponible | null> {
    return this.repository.buscar();
  }
}
