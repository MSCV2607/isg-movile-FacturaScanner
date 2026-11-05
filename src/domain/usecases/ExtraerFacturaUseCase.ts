import { ExtraccionFactura } from '../entities/ExtraccionFactura';
import { ImagenFactura } from '../entities/ImagenFactura';
import { ConfiguracionRepository } from '../repositories/ConfiguracionRepository';
import { ExtractorFacturaRepository } from '../repositories/ExtractorFacturaRepository';

/** Lee las fotos de una factura (una, o varias si es un ticket largo) y devuelve sus datos. */
export class ExtraerFacturaUseCase {
  constructor(
    private readonly extractor: ExtractorFacturaRepository,
    private readonly configuracion: ConfiguracionRepository,
  ) {}

  /** Con `correcciones`, es una segunda lectura de las mismas fotos que atiende los problemas de la anterior. */
  async ejecutar(imagenes: ImagenFactura[], correcciones: string[] = []): Promise<ExtraccionFactura> {
    const { apiKeyIa } = await this.configuracion.obtener();
    return this.extractor.extraer(imagenes, apiKeyIa, correcciones);
  }
}
