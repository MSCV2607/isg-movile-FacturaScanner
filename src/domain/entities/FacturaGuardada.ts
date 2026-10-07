import { Factura } from './Factura';

/** Factura confirmada por el usuario y guardada en la base de datos del celular. */
export interface FacturaGuardada {
  id: number;
  /** Cuándo se guardó. */
  creadaEn: Date;
  factura: Factura;
  /** Fotos originales guardadas en el celular (rutas listas para mostrar), de arriba hacia abajo. */
  fotos: string[];
}
