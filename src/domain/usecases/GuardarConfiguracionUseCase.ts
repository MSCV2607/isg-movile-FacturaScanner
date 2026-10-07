import { Configuracion } from '../entities/Configuracion';
import { ConfiguracionRepository } from '../repositories/ConfiguracionRepository';

/** Guarda la configuración (se quitan los espacios sobrantes de los textos). */
export class GuardarConfiguracionUseCase {
  constructor(private readonly configuracion: ConfiguracionRepository) {}

  async ejecutar(entrada: Configuracion): Promise<void> {
    await this.configuracion.guardar({
      endpointUrl: entrada.endpointUrl.trim(),
      token: entrada.token.trim(),
      apiKeyIa: entrada.apiKeyIa.trim(),
    });
  }
}
