import { Factura } from '../entities/Factura';
import { ImagenFactura } from '../entities/ImagenFactura';
import { ConfiguracionRepository } from '../repositories/ConfiguracionRepository';
import { ExtractorFacturaRepository } from '../repositories/ExtractorFacturaRepository';

/** Lee las fotos de una factura (una, o varias si es un ticket largo) y devuelve sus datos. */
export class ExtraerFacturaUseCase {
  constructor(
    private readonly extractor: ExtractorFacturaRepository,
    private readonly configuracion: ConfiguracionRepository,
  ) {}

  async ejecutar(imagenes: ImagenFactura[]): Promise<Factura> {
    const { apiKeyIa } = await this.configuracion.obtener();
    return this.extractor.extraer(imagenes, apiKeyIa);
  }
}
