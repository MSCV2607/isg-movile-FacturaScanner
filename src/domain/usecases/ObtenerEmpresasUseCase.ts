import { Empresa } from '../entities/Empresa';
import { EmpresaRepository } from '../repositories/EmpresaRepository';

export class ObtenerEmpresasUseCase {
  constructor(private readonly empresas: EmpresaRepository) {}

  ejecutar(): Promise<Empresa[]> {
    return this.empresas.obtenerTodas();
  }
}
