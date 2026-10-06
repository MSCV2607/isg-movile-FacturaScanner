import { Configuracion } from '../entities/Configuracion';
import { ConfiguracionRepository } from '../repositories/ConfiguracionRepository';

export class ObtenerConfiguracionUseCase {
  constructor(private readonly configuracion: ConfiguracionRepository) {}

  ejecutar(): Promise<Configuracion> {
    return this.configuracion.obtener();
  }
}
