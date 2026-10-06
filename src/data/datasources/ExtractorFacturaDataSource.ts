import { ImagenFactura } from '@domain/entities/ImagenFactura';

import { FacturaExtraidaDto } from '../dtos/FacturaExtraidaDto';

/** Lanza `ErrorExtraccion` si no hay conexión, la clave es inválida, etc. */
export interface ExtractorFacturaDataSource {
  extraer(imagenes: ImagenFactura[], apiKey: string): Promise<FacturaExtraidaDto>;
}
