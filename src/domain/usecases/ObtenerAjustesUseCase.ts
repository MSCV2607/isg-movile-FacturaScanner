import { Ajustes } from '../entities/Ajustes';
import { AjustesRepository } from '../repositories/AjustesRepository';

export class ObtenerAjustesUseCase {
  constructor(private readonly ajustes: AjustesRepository) {}

  ejecutar(): Promise<Ajustes> {
    return this.ajustes.obtener();
  }
}
