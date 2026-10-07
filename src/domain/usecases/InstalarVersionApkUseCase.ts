import { VersionApk } from '../entities/VersionApk';
import { VersionApkRepository } from '../repositories/VersionApkRepository';

/** Descarga el APK nuevo y abre el instalador de Android. */
export class InstalarVersionApkUseCase {
  constructor(private readonly repository: VersionApkRepository) {}

  ejecutar(version: VersionApk): Promise<void> {
    return this.repository.instalar(version);
  }
}
