import { DesgloseIva } from '../entities/LibroIva';
import { Factura, ItemFactura } from '../entities/Factura';
import { importeConSigno, redondear2 } from './comprobante';

const ALICUOTAS_COMUNES = [21, 10.5, 27] as const;
/** Alícuotas poco usadas que igual se reconocen al deducirla de neto e IVA. */
const ALICUOTAS_ESPECIALES = [5, 2.5] as const;

/** Diferencia (en pesos o en proporción) que se tolera entre lo que dicen los ítems y el encabezado. */
const TOLERANCIA_PESOS = 1;
const TOLERANCIA_PROPORCION = 0.02;

const mismaAlicuota = (a: number, b: number) => Math.abs(a - b) < 0.01;

function desgloseVacio(): DesgloseIva {
  return {
    neto21: 0, neto105: 0, neto27: 0, netoOtras: 0, noGravado: 0,
    iva21: 0, iva105: 0, iva27: 0, ivaOtras: 0, otrosConceptos: 0, total: 0,
  };
}

/** Pone un neto y su IVA en la columna que corresponde a la alícuota. */
function acumular(desglose: DesgloseIva, alicuota: number, neto: number, iva: number): void {
  if (mismaAlicuota(alicuota, 21)) {
    desglose.neto21 += neto;
    desglose.iva21 += iva;
  } else if (mismaAlicuota(alicuota, 10.5)) {
    desglose.neto105 += neto;
    desglose.iva105 += iva;
  } else if (mismaAlicuota(alicuota, 27)) {
    desglose.neto27 += neto;
    desglose.iva27 += iva;
  } else if (alicuota <= 0) {
    desglose.noGravado += neto;
  } else {
    desglose.netoOtras += neto;
    desglose.ivaOtras += iva;
  }
}

/** Deduce la alícuota de una factura que no detalla ítems: IVA ÷ neto, si da una alícuota conocida. */
function alicuotaDeducida(neto: number, iva: number): number | null {
  if (neto <= 0 || iva <= 0) return null;
  const tasa = (iva / neto) * 100;
  const conocida = [...ALICUOTAS_COMUNES, ...ALICUOTAS_ESPECIALES].find((alicuota) => Math.abs(tasa - alicuota) <= 0.6);
  return conocida ?? tasa;
}

/** Reparte los ítems por alícuota. null si no se puede confiar en ellos (no cierran con el neto o el IVA del encabezado). */
function desglosarPorItems(items: ItemFactura[], importeNeto: number, importeIva: number, alicuotaGeneral: number | null): DesgloseIva | null {
  if (items.length === 0 || importeNeto <= 0) return null;

  const netoItems = items.reduce((suma, item) => suma + item.subtotal, 0);
  if (Math.abs(netoItems - importeNeto) > Math.max(TOLERANCIA_PESOS, importeNeto * TOLERANCIA_PROPORCION)) return null;

  const netoPorAlicuota = new Map<number, number>();
  for (const item of items) {
    // Un ítem sin alícuota usa la general de la factura (si no hay IVA, es no gravado).
    const alicuota = item.alicuotaIva ?? alicuotaGeneral ?? 0;
    netoPorAlicuota.set(alicuota, (netoPorAlicuota.get(alicuota) ?? 0) + item.subtotal);
  }

  const desglose = desgloseVacio();
  let ivaCalculado = 0;
  for (const [alicuota, neto] of netoPorAlicuota) {
    const iva = redondear2((neto * alicuota) / 100);
    ivaCalculado += iva;
    acumular(desglose, alicuota, neto, iva);
  }

  if (Math.abs(ivaCalculado - importeIva) > Math.max(TOLERANCIA_PESOS, importeIva * TOLERANCIA_PROPORCION)) return null;
  return desglose;
}

/**
 * Reparte neto e IVA de una factura por alícuota. Prefiere el detalle de ítems; si no cierra con los
 * importes del encabezado (la IA pudo leer mal un ítem), deduce la alícuota con IVA ÷ neto.
 * El resultado lleva el signo del comprobante: las notas de crédito restan.
 */
export function desglosarIva(factura: Factura): DesgloseIva {
  const { importeNeto, importeIva, importeTotal, items } = factura;
  const alicuotaGeneral = alicuotaDeducida(importeNeto, importeIva);

  let desglose = desglosarPorItems(items, importeNeto, importeIva, alicuotaGeneral);

  if (!desglose) {
    desglose = desgloseVacio();
    if (importeNeto <= 0 && importeIva <= 0) {
      // Sin discriminar: todo el importe cuenta como no gravado.
      desglose.noGravado = importeTotal;
    } else if (importeIva <= 0) {
      desglose.noGravado = importeNeto;
    } else {
      if (alicuotaGeneral === null) {
        // IVA sin neto con qué compararlo: no hay alícuota que deducir, va a "otras" para no perderlo.
        desglose.netoOtras += importeNeto;
        desglose.ivaOtras += importeIva;
      } else {
        acumular(desglose, alicuotaGeneral, importeNeto, importeIva);
      }
    }
  }

  const netoTotal = desglose.neto21 + desglose.neto105 + desglose.neto27 + desglose.netoOtras + desglose.noGravado;
  const ivaTotal = desglose.iva21 + desglose.iva105 + desglose.iva27 + desglose.ivaOtras;
  desglose.otrosConceptos = importeTotal - netoTotal - ivaTotal;
  desglose.total = importeTotal;

  const firmado = desgloseVacio();
  for (const campo of Object.keys(desglose) as (keyof DesgloseIva)[]) {
    firmado[campo] = redondear2(importeConSigno(factura.tipoComprobante, desglose[campo]));
  }
  return firmado;
}
