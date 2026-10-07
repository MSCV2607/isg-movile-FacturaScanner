import { ActualizacionDisponible } from './ActualizacionDisponible';
import { VersionApk } from './VersionApk';

/**
 * Lo nuevo que hay para la app: un APK completo (cambió algo nativo, hay que reinstalar)
 * o solo código (se baja por aire y la app se reinicia sola).
 */
export type NovedadApp =
  | { tipo: 'apk'; version: VersionApk }
  | { tipo: 'codigo'; actualizacion: ActualizacionDisponible };
