import { VersionApk } from '@domain/entities/VersionApk';
import { VersionApkRepository } from '@domain/repositories/VersionApkRepository';

import { InstaladorApkDataSource } from '../datasources/InstaladorApkDataSource';
import { VersionApkDataSource } from '../datasources/VersionApkDataSource';
import { versionApkDesdeDto } from '../mappers/versionApkMapper';

export class VersionApkRepositoryImpl implements VersionApkRepository {
  constructor(
    private readonly datos: VersionApkDataSource,
    private readonly instalador: InstaladorApkDataSource,
  ) {}

  async ultima(): Promise<VersionApk | null> {
    const dto = await this.datos.obtenerUltima();
    return dto ? versionApkDesdeDto(dto) : null;
  }

  instalar(version: VersionApk): Promise<void> {
    return this.instalador.descargarEInstalar(version.url);
  }
}
