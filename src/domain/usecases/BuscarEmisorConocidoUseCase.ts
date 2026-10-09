import { EmisorConocido } from '../entities/EmisorConocido';
import { esCuitValido } from '../rules/cuit';
import { FacturaLocalRepository } from '../repositories/FacturaLocalRepository';

/** Si ya se le guardó una factura a este CUIT, devuelve lo que se cargó entonces (razón social, condición, rubro). */
export class BuscarEmisorConocidoUseCase {
  constructor(private readonly facturas: FacturaLocalRepository) {}

  async ejecutar(cuit: string): Promise<EmisorConocido | null> {
    if (!esCuitValido(cuit)) return null;
    return this.facturas.buscarUltimoEmisor(cuit);
  }
}
