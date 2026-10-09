import { Ajustes } from '@domain/entities/Ajustes';
import { AjustesRepository } from '@domain/repositories/AjustesRepository';

import { AjustesStorageDataSource } from '../datasources/AjustesStorageDataSource';
import { ajustesMapper } from '../mappers/ajustesMapper';

export class AjustesRepositoryImpl implements AjustesRepository {
  constructor(private readonly storage: AjustesStorageDataSource) {}

  async obtener(): Promise<Ajustes> {
    return ajustesMapper.toEntity(await this.storage.leer());
  }

  guardar(ajustes: Ajustes): Promise<void> {
    return this.storage.guardar(ajustesMapper.toDto(ajustes));
  }
}
