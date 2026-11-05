import { CampoFactura, Factura } from './Factura';

/** Lo que la IA leyó de las fotos: la factura y algunos datos de control que no se guardan. */
export interface ExtraccionFactura {
  factura: Factura;
  /** CUIT del cliente (receptor), solo dígitos. Sirve para detectar que la IA lo confundió con el emisor. */
  cuitReceptor: string;
  /** Percepciones, impuestos internos y otros tributos: no son neto ni IVA, pero suman al total. */
  otrosTributos: number;
  /** Campos que la propia IA marcó como poco legibles o adivinados. */
  camposDudosos: CampoFactura[];
  /** Servicio de IA que hizo la lectura ('gemini', 'anthropic', 'simulado'). */
  proveedor: string;
}
