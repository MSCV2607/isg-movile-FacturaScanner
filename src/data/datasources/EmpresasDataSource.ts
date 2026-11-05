import { EmpresaDto } from '../dtos/EmpresaDto';

/** Lanza un error si no se puede obtener la lista (sin red, tiempo agotado, respuesta inválida). */
export interface EmpresasDataSource {
  obtener(): Promise<EmpresaDto[]>;
}
