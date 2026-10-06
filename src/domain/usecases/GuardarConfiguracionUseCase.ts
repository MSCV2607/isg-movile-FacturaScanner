import { Configuracion, ErroresConfiguracion } from '../entities/Configuracion';
import { ConfiguracionRepository } from '../repositories/ConfiguracionRepository';

/** Valida y guarda. Si hay errores no guarda nada y los devuelve. */
export class GuardarConfiguracionUseCase {
  constructor(private readonly configuracion: ConfiguracionRepository) {}

  async ejecutar(entrada: Configuracion): Promise<ErroresConfiguracion> {
    const configuracion: Configuracion = {
      endpointUrl: entrada.endpointUrl.trim(),
      token: entrada.token.trim(),
      apiKeyIa: entrada.apiKeyIa.trim(),
    };

    if (!/^https?:\/\/\S+$/i.test(configuracion.endpointUrl)) {
      return { endpointUrl: 'Ingresá una URL que empiece con http:// o https://' };
    }

    await this.configuracion.guardar(configuracion);
    return {};
  }
}
