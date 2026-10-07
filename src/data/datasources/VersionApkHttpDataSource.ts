import { URL_DATOS_APK } from '@core/config/env';
import { ErrorActualizacion } from '@core/errors/ErrorActualizacion';

import { VersionApkDto } from '../dtos/VersionApkDto';
import { VersionApkDataSource } from './VersionApkDataSource';

const TIEMPO_MAXIMO_MS = 10000;
const SIN_CONEXION = 'No se pudo consultar si hay una versión nueva. Revisá la conexión a internet.';

/** Lee el JSON con los datos del último APK desde la dirección configurada en `URL_DATOS_APK`. */
export class VersionApkHttpDataSource implements VersionApkDataSource {
  async obtenerUltima(): Promise<VersionApkDto | null> {
    if (URL_DATOS_APK === '') return null;

    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), TIEMPO_MAXIMO_MS);

    try {
      // El parámetro "t" evita que se devuelva una copia vieja guardada en el camino.
      const respuesta = await fetch(`${URL_DATOS_APK}?t=${Date.now()}`, {
        signal: control.signal,
        headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' },
      });
      if (!respuesta.ok) throw new ErrorActualizacion(SIN_CONEXION);
      return (await respuesta.json()) as VersionApkDto;
    } catch (error) {
      throw error instanceof ErrorActualizacion ? error : new ErrorActualizacion(SIN_CONEXION);
    } finally {
      clearTimeout(temporizador);
    }
  }
}
