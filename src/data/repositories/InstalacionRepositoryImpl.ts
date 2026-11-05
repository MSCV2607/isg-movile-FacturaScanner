import { Platform } from 'react-native';

import { generarUuidV4 } from '@core/utils/uuid';
import { Instalacion } from '@domain/entities/Instalacion';
import { InstalacionRepository } from '@domain/repositories/InstalacionRepository';

import { InstalacionStorageDataSource } from '../datasources/InstalacionStorageDataSource';

export class InstalacionRepositoryImpl implements InstalacionRepository {
  constructor(private readonly storage: InstalacionStorageDataSource) {}

  async obtener(): Promise<Instalacion> {
    let id = await this.storage.leerId();
    if (!id) {
      id = generarUuidV4();
      await this.storage.guardarId(id);
    }
    return { id, plataforma: Platform.OS === 'ios' ? 'ios' : 'android' };
  }
}
