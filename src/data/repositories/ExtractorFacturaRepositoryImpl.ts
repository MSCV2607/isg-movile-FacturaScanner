import { Factura } from '@domain/entities/Factura';
import { ImagenFactura } from '@domain/entities/ImagenFactura';
import { ExtractorFacturaRepository } from '@domain/repositories/ExtractorFacturaRepository';

import { ExtractorFacturaDataSource } from '../datasources/ExtractorFacturaDataSource';
import { facturaExtraidaToEntity } from '../mappers/facturaExtraidaMapper';

export class ExtractorFacturaRepositoryImpl implements ExtractorFacturaRepository {
  constructor(private readonly dataSource: ExtractorFacturaDataSource) {}

  async extraer(imagenes: ImagenFactura[], apiKey: string): Promise<Factura> {
    const dto = await this.dataSource.extraer(imagenes, apiKey);
    return facturaExtraidaToEntity(dto);
  }
}
