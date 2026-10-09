import { ResumenFactura } from '../entities/ResumenFactura';
import { TotalMensual } from '../entities/TotalMensual';
import { importeConSigno, redondear2 } from './comprobante';

export interface MesCalendario {
  anio: number;
  /** 0 = enero. Puede salirse de rango (-1 = diciembre anterior). */
  mes: number;
}

/** Los `cantidad` meses que terminan en `ultimo`, del más viejo al más nuevo. */
export function ultimosMeses(ultimo: MesCalendario, cantidad: number): MesCalendario[] {
  return Array.from({ length: cantidad }, (_, i) => {
    const fecha = new Date(ultimo.anio, ultimo.mes - (cantidad - 1 - i), 1);
    return { anio: fecha.getFullYear(), mes: fecha.getMonth() };
  });
}

/** Total en pesos por mes (según la fecha de emisión). Los meses sin facturas dan 0. */
export function totalesPorMes(facturas: ResumenFactura[], meses: MesCalendario[]): TotalMensual[] {
  const sumas = new Map<string, number>();
  for (const factura of facturas) {
    if (factura.moneda !== 'ARS') continue;
    const clave = factura.fecha.slice(0, 7);
    sumas.set(clave, (sumas.get(clave) ?? 0) + importeConSigno(factura.tipoComprobante, factura.importe));
  }
  return meses.map(({ anio, mes }) => ({
    anio,
    mes,
    total: redondear2(sumas.get(`${anio}-${String(mes + 1).padStart(2, '0')}`) ?? 0),
  }));
}

/** Cuánto cambió el gasto respecto del mes anterior, en %. null si el mes anterior no tiene gasto con qué comparar. */
export function variacionPorcentual(actual: number, anterior: number): number | null {
  if (anterior <= 0) return null;
  return Math.round(((actual - anterior) / anterior) * 100);
}
