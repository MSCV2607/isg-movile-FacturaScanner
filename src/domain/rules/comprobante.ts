import { normalizarTexto } from './texto';

/** Lo que identifica a un comprobante: dos con la misma clave son el mismo documento. */
export interface ClaveComprobante {
  /** CUIT del emisor, solo dígitos. */
  cuit: string;
  tipoComprobante: string;
  letra: string;
  puntoVenta: number;
  numero: number;
}

export function mismoComprobante(a: ClaveComprobante, b: ClaveComprobante): boolean {
  return (
    a.cuit === b.cuit &&
    a.puntoVenta === b.puntoVenta &&
    a.numero === b.numero &&
    normalizarTexto(a.letra) === normalizarTexto(b.letra) &&
    normalizarTexto(a.tipoComprobante) === normalizarTexto(b.tipoComprobante)
  );
}

/** Las notas de crédito restan: devuelven plata o anulan una factura. */
export function esNotaDeCredito(tipoComprobante: string): boolean {
  return normalizarTexto(tipoComprobante).includes('credito');
}

/** 1 para una factura o nota de débito, -1 para una nota de crédito. */
export function signoDelComprobante(tipoComprobante: string): 1 | -1 {
  return esNotaDeCredito(tipoComprobante) ? -1 : 1;
}

/** Aplica el signo del comprobante a un importe (las notas de crédito restan). */
export function importeConSigno(tipoComprobante: string, importe: number): number {
  return signoDelComprobante(tipoComprobante) * importe;
}

/** Redondea a centavos para no arrastrar errores de coma flotante al sumar. */
export function redondear2(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

/** Nombre corto y único para los archivos de una factura: "A_0004-00001234_17". */
export function etiquetaDeArchivo(factura: { letra: string; puntoVenta: number; numero: number; id: number }): string {
  const puntoVenta = String(factura.puntoVenta).padStart(4, '0');
  const numero = String(factura.numero).padStart(8, '0');
  return `${factura.letra || 'X'}_${puntoVenta}-${numero}_${factura.id}`;
}
