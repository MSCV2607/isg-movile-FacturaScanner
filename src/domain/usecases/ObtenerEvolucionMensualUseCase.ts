import { TotalMensual } from '../entities/TotalMensual';
import { FacturaLocalRepository } from '../repositories/FacturaLocalRepository';
import { MesCalendario, totalesPorMes, ultimosMeses } from '../rules/evolucion';
import { rangoDelMes } from '../rules/periodos';

/** Gasto mes a mes de los últimos meses, para ver si sube o baja. */
export class ObtenerEvolucionMensualUseCase {
  constructor(private readonly facturas: FacturaLocalRepository) {}

  async ejecutar(ultimo: MesCalendario, cantidad: number): Promise<TotalMensual[]> {
    const meses = ultimosMeses(ultimo, cantidad);
    const desde = rangoDelMes(meses[0].anio, meses[0].mes).desde;
    const hasta = rangoDelMes(ultimo.anio, ultimo.mes).hasta;

    const facturas = await this.facturas.obtenerTodas({ desde, hasta });
    return totalesPorMes(facturas, meses);
  }
}
