import { Sesion } from '@domain/entities/Sesion';
import { SesionRepository } from '@domain/repositories/SesionRepository';

import { SesionStorageDataSource } from '../datasources/SesionStorageDataSource';

export class SesionRepositoryImpl implements SesionRepository {
  constructor(private readonly storage: SesionStorageDataSource) {}

  guardar(sesion: Sesion): Promise<void> {
    return this.storage.guardar(sesion);
  }
}
