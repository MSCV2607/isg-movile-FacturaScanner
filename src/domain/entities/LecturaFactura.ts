import { CampoFactura, Factura } from './Factura';

/** Un dato que la IA leyó distinto del QR de ARCA (se usó el del QR). */
export interface Discrepancia {
  campo: CampoFactura;
  /** Lo que había leído la IA, tal como se mostraría. */
  valorIa: string;
}

/** Resultado de leer una factura: foto (IA) y QR combinados. */
export interface LecturaFactura {
  factura: Factura;
  discrepancias: Discrepancia[];
  /** Algo que el usuario debe saber de esta lectura (por ejemplo, que la IA falló y se usó solo el QR). */
  aviso: string | null;
}
