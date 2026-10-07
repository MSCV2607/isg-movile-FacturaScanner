import { compararVersiones } from '@core/utils/versiones';

import { VersionApk } from '../entities/VersionApk';
import { VersionApkRepository } from '../repositories/VersionApkRepository';

/** Busca si hay un APK más nuevo que el instalado. */
export class BuscarVersionApkUseCase {
  constructor(
    private readonly repository: VersionApkRepository,
    private readonly versionInstalada: string,
  ) {}

  /** Devuelve el APK nuevo, o null si el instalado ya es el último. */
  async ejecutar(): Promise<VersionApk | null> {
    const ultima = await this.repository.ultima();
    if (!ultima) return null;
    return compararVersiones(ultima.version, this.versionInstalada) > 0 ? ultima : null;
  }
}
