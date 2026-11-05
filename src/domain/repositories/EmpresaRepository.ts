import { Empresa } from '../entities/Empresa';

export interface EmpresaRepository {
  /** Empresas activas. Lanza un error si no se puede obtener la lista. */
  obtenerTodas(): Promise<Empresa[]>;
}
