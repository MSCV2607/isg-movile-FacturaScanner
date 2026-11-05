import { ImagenFactura } from '@domain/entities/ImagenFactura';

import { FacturaExtraidaDto } from '../dtos/FacturaExtraidaDto';

/**
 * Lanza `ErrorExtraccion` si no hay conexión, la clave es inválida, etc.
 * `correcciones` son los problemas de una lectura anterior (segunda pasada); vacío en la primera.
 */
export interface ExtractorFacturaDataSource {
  extraer(imagenes: ImagenFactura[], apiKey: string, correcciones?: string[]): Promise<FacturaExtraidaDto>;
}
