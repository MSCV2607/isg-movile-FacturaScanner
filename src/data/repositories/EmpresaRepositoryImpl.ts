import { Empresa } from '@domain/entities/Empresa';
import { EmpresaRepository } from '@domain/repositories/EmpresaRepository';

import { EmpresasDataSource } from '../datasources/EmpresasDataSource';

export class EmpresaRepositoryImpl implements EmpresaRepository {
  constructor(private readonly dataSource: EmpresasDataSource) {}

  async obtenerTodas(): Promise<Empresa[]> {
    const dtos = await this.dataSource.obtener();
    return dtos
      .filter((dto) => dto.activa !== false)
      .map((dto) => ({ id: dto.id, nombre: dto.nombre, urlAuth: dto.urlAuth ?? '' }));
  }
}
