import { Factura } from '../entities/Factura';
import { FacturaGuardada } from '../entities/FacturaGuardada';
import { ImagenFactura } from '../entities/ImagenFactura';
import { ResumenFactura } from '../entities/ResumenFactura';

/** Facturas guardadas en el celular (datos y fotos originales). */
export interface FacturaLocalRepository {
  /** Guarda la factura y sus fotos. Si algo falla no queda nada a medias. */
  guardar(factura: Factura, fotos: ImagenFactura[]): Promise<FacturaGuardada>;
  /** Las más recientes primero. */
  obtenerUltimas(cantidad: number): Promise<ResumenFactura[]>;
  /** null si no existe (por ejemplo, si se borró). */
  obtener(id: number): Promise<FacturaGuardada | null>;
}
