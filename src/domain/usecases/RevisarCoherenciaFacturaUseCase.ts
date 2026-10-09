import { DiferenciaDeTotal } from '../entities/DiferenciaDeTotal';
import { Factura } from '../entities/Factura';
import { redondear2 } from '../rules/comprobante';

/** Diferencia de centavos que se tolera por redondeos de la factura. */
const TOLERANCIA = 0.05;

/**
 * Avisos que no impiden guardar: la factura puede ser correcta aunque no cierre (otros tributos,
 * percepciones, descuentos). Sirven para que el usuario mire el campo antes de confirmar.
 */
export class RevisarCoherenciaFacturaUseCase {
  /** null si neto + IVA da el total, o si no hay neto ni IVA para comparar. */
  diferenciaDeTotal(factura: Pick<Factura, 'importeNeto' | 'importeIva' | 'importeTotal'>): DiferenciaDeTotal | null {
    const { importeNeto, importeIva, importeTotal } = factura;
    if (![importeNeto, importeIva, importeTotal].every(Number.isFinite)) return null;
    if (importeNeto === 0 && importeIva === 0) return null;

    const sumaNetoIva = redondear2(importeNeto + importeIva);
    if (Math.abs(sumaNetoIva - importeTotal) <= TOLERANCIA) return null;
    return { sumaNetoIva, total: importeTotal };
  }
}
