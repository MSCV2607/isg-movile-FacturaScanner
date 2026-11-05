import { ExtraccionFactura } from '../entities/ExtraccionFactura';
import { ImagenFactura } from '../entities/ImagenFactura';

export interface ExtractorFacturaRepository {
  /**
   * Lanza `ErrorExtraccion` (con mensaje para el usuario) si no se pudo leer la factura.
   * `imagenes` son tramos de una misma factura, ordenados de arriba hacia abajo.
   * `correcciones` son problemas de una lectura anterior de estas mismas fotos: la IA los tiene en cuenta al volver a leer.
   */
  extraer(imagenes: ImagenFactura[], apiKey: string, correcciones?: string[]): Promise<ExtraccionFactura>;
}
