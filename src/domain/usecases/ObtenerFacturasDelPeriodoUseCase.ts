import { ResumenFactura } from '../entities/ResumenFactura';
import { FacturaLocalRepository } from '../repositories/FacturaLocalRepository';
import { Periodo, rangoDelMes, rangoDelPeriodo } from '../rules/periodos';

/** Facturas guardadas de un período (o de un mes puntual), las de fecha más nueva primero. */
export class ObtenerFacturasDelPeriodoUseCase {
  constructor(private readonly facturas: FacturaLocalRepository) {}

  ejecutar(periodo: Periodo, hoy: Date = new Date()): Promise<ResumenFactura[]> {
    return this.facturas.obtenerTodas(rangoDelPeriodo(periodo, hoy));
  }

  delMes(anio: number, mes: number): Promise<ResumenFactura[]> {
    return this.facturas.obtenerTodas(rangoDelMes(anio, mes));
  }
}
