import { ExtraccionFactura } from '@domain/entities/ExtraccionFactura';
import { ImagenFactura } from '@domain/entities/ImagenFactura';
import { ExtractorFacturaRepository } from '@domain/repositories/ExtractorFacturaRepository';

import { ExtractorFacturaDataSource } from '../datasources/ExtractorFacturaDataSource';
import { facturaExtraidaToExtraccion } from '../mappers/facturaExtraidaMapper';

export class ExtractorFacturaRepositoryImpl implements ExtractorFacturaRepository {
  /** `proveedor` es el nombre del servicio de IA; queda anotado en cada lectura. */
  constructor(
    private readonly dataSource: ExtractorFacturaDataSource,
    private readonly proveedor: string,
  ) {}

  async extraer(imagenes: ImagenFactura[], apiKey: string, correcciones: string[] = []): Promise<ExtraccionFactura> {
    const dto = await this.dataSource.extraer(imagenes, apiKey, correcciones);
    return facturaExtraidaToExtraccion(dto, this.proveedor);
  }
}
