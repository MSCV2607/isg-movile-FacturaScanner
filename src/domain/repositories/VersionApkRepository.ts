import { VersionApk } from '../entities/VersionApk';

/** Consulta cuál es el último APK publicado y lo instala. */
export interface VersionApkRepository {
  /** Devuelve el último APK publicado, o null si no hay datos o no está configurado. Falla si no se puede consultar. */
  ultima(): Promise<VersionApk | null>;
  /** Descarga el APK y abre el instalador de Android (el usuario confirma la instalación). */
  instalar(version: VersionApk): Promise<void>;
}
