import { ResumenPrecisionIa } from '../entities/RegistroLectura';
import { FacturaLocalRepository } from '../repositories/FacturaLocalRepository';
import { resumirPrecisionIa } from '../rules/precisionIa';

/** Cuánto acierta la lectura con IA, según cuánto tuvo que corregir el usuario en las facturas que guardó. */
export class ObtenerPrecisionIaUseCase {
  constructor(private readonly facturas: FacturaLocalRepository) {}

  async ejecutar(): Promise<ResumenPrecisionIa> {
    return resumirPrecisionIa(await this.facturas.obtenerLecturasIa());
  }
}
