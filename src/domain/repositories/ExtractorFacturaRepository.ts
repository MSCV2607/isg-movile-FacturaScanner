import { Factura } from '../entities/Factura';
import { ImagenFactura } from '../entities/ImagenFactura';

export interface ExtractorFacturaRepository {
  /** Lanza `ErrorExtraccion` (con mensaje para el usuario) si no se pudo leer la factura. */
  /** `imagenes` son tramos de una misma factura, ordenados de arriba hacia abajo. */
  extraer(imagenes: ImagenFactura[], apiKey: string): Promise<Factura>;
}
