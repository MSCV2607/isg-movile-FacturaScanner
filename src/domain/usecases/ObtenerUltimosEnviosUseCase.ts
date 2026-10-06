import { Envio } from '@domain/entities/Envio';
import { EnvioRepository } from '@domain/repositories/EnvioRepository';

const CANTIDAD_POR_DEFECTO = 3;

export class ObtenerUltimosEnviosUseCase {
  constructor(private readonly envioRepository: EnvioRepository) {}

  ejecutar(cantidad: number = CANTIDAD_POR_DEFECTO): Promise<Envio[]> {
    return this.envioRepository.obtenerUltimos(cantidad);
  }
}
