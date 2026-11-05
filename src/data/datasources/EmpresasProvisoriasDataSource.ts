import { EMPRESAS_PROVISORIAS } from '@core/config/empresasProvisorias';

import { EmpresaDto } from '../dtos/EmpresaDto';
import { EmpresasDataSource } from './EmpresasDataSource';

/** Lista fija para usar la app sin la api de empresas (URL_API_EMPRESA vacía). */
export class EmpresasProvisoriasDataSource implements EmpresasDataSource {
  async obtener(): Promise<EmpresaDto[]> {
    return EMPRESAS_PROVISORIAS.map((nombre, indice) => ({ id: indice + 1, nombre, urlAuth: '' }));
  }
}
