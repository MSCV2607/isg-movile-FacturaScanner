import { VersionApkDto } from '../dtos/VersionApkDto';

export interface VersionApkDataSource {
  /** Lee los datos del último APK publicado. null si la búsqueda no está configurada. */
  obtenerUltima(): Promise<VersionApkDto | null>;
}
