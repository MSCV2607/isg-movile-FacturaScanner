import { CampoFactura, Factura } from './Factura';
import { RegistroLectura } from './RegistroLectura';

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
  /** Campos que la IA no leyó con seguridad: la revisión los marca para que el usuario los mire con la factura a mano. */
  camposDudosos: CampoFactura[];
  /** Cómo se hizo la lectura, para medir después cuánto corrigió el usuario. null si la IA no participó. */
  registro: RegistroLectura | null;
}
