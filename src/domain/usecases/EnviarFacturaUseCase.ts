import { Factura } from '../entities/Factura';
import { ResultadoEnvio } from '../entities/ResultadoEnvio';
import { ConfiguracionRepository } from '../repositories/ConfiguracionRepository';
import { ServidorRepository } from '../repositories/ServidorRepository';

export class EnviarFacturaUseCase {
  constructor(
    private readonly servidor: ServidorRepository,
    private readonly configuracion: ConfiguracionRepository,
  ) {}

  async ejecutar(factura: Factura): Promise<ResultadoEnvio> {
    const configuracion = await this.configuracion.obtener();
    return this.servidor.enviarFactura(factura, configuracion);
  }
}
