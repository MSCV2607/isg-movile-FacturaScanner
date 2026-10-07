import { ActualizacionRepository } from '../repositories/ActualizacionRepository';

/** Descarga la actualización y reinicia la app. */
export class InstalarActualizacionUseCase {
  constructor(private readonly repository: ActualizacionRepository) {}

  ejecutar(): Promise<void> {
    return this.repository.instalar();
  }
}
