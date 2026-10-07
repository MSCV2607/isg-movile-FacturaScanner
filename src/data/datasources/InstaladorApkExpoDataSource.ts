import { File, Paths } from 'expo-file-system';
import { getContentUriAsync } from 'expo-file-system/legacy';
import { startActivityAsync } from 'expo-intent-launcher';
import { Linking } from 'react-native';

import { ErrorActualizacion } from '@core/errors/ErrorActualizacion';

import { InstaladorApkDataSource } from './InstaladorApkDataSource';

const NOMBRE_ARCHIVO = 'isg-facturascanner-actualizacion.apk';
const TIPO_APK = 'application/vnd.android.package-archive';
// Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK
const BANDERAS = 1 | 268435456;

/**
 * Descarga el APK a la caché y se lo entrega al instalador de Android. Android no deja instalar en
 * silencio: el usuario confirma, y la primera vez también debe permitir instalar desde esta app.
 */
export class InstaladorApkExpoDataSource implements InstaladorApkDataSource {
  async descargarEInstalar(url: string): Promise<void> {
    const archivo = await this.descargar(url);

    try {
      const uriDeContenido = await getContentUriAsync(archivo.uri);
      await startActivityAsync('android.intent.action.VIEW', {
        data: uriDeContenido,
        type: TIPO_APK,
        flags: BANDERAS,
      });
    } catch {
      await this.abrirEnElNavegador(url);
    }
  }

  private async descargar(url: string): Promise<File> {
    try {
      return await File.downloadFileAsync(url, new File(Paths.cache, NOMBRE_ARCHIVO), { idempotent: true });
    } catch {
      throw new ErrorActualizacion('No se pudo descargar la versión nueva. Probá de nuevo con buena conexión.');
    }
  }

  /** Si el instalador no se pudo abrir, se baja el APK desde el navegador para instalarlo a mano. */
  private async abrirEnElNavegador(url: string): Promise<void> {
    try {
      await Linking.openURL(url);
    } catch {
      throw new ErrorActualizacion('No se pudo abrir el instalador. Probá de nuevo.');
    }
  }
}
