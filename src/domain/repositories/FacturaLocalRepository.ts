import { EmisorConocido } from '../entities/EmisorConocido';
import { Factura } from '../entities/Factura';
import { FacturaGuardada } from '../entities/FacturaGuardada';
import { ImagenFactura } from '../entities/ImagenFactura';
import { RangoFechas } from '../entities/RangoFechas';
import { ResumenFactura } from '../entities/ResumenFactura';

/** Facturas guardadas en el celular (datos y fotos originales). */
export interface FacturaLocalRepository {
  /** Guarda la factura y sus fotos. Si algo falla no queda nada a medias. */
  guardar(factura: Factura, fotos: ImagenFactura[]): Promise<FacturaGuardada>;
  /** Las más recientes primero. */
  obtenerUltimas(cantidad: number): Promise<ResumenFactura[]>;
  /** Las del rango de fechas de emisión (extremos incluidos), las de fecha más nueva primero. */
  obtenerTodas(rango: RangoFechas): Promise<ResumenFactura[]>;
  /** Facturas ya guardadas con ese CUIT, punto de venta y número (sin mirar tipo ni letra). */
  buscarPorComprobante(cuit: string, puntoVenta: number, numero: number): Promise<ResumenFactura[]>;
  /** Lo que se sabe del emisor según su factura guardada más reciente; null si nunca se le guardó una. */
  buscarUltimoEmisor(cuit: string): Promise<EmisorConocido | null>;
  /** Reemplaza los datos y los ítems de una factura guardada; las fotos quedan como estaban. */
  actualizar(id: number, factura: Factura): Promise<void>;
  /** Borra la factura con sus ítems y sus fotos. No se puede deshacer. */
  eliminar(id: number): Promise<void>;
  /** Cambia el nombre de un rubro en todas las facturas que lo usan. Devuelve cuántas cambió. */
  renombrarCategoria(anterior: string, nueva: string): Promise<number>;
  /** null si no existe (por ejemplo, si se borró). */
  obtener(id: number): Promise<FacturaGuardada | null>;
}
