import * as Updates from 'expo-updates';

import { ErrorActualizacion } from '@core/errors/ErrorActualizacion';

import { ActualizacionesDataSource, ResultadoConsulta } from './ActualizacionesDataSource';

const SIN_SOPORTE = 'Las actualizaciones solo funcionan en la app instalada (APK), no en Expo Go.';

/** Actualizaciones por aire de Expo (EAS Update): cambian el código sin reinstalar el APK. */
export class ActualizacionesExpoDataSource implements ActualizacionesDataSource {
  async consultar(): Promise<ResultadoConsulta> {
    if (!Updates.isEnabled) throw new ErrorActualizacion(SIN_SOPORTE);

    try {
      const resultado = await Updates.checkForUpdateAsync();
      if (!resultado.isAvailable) return { hayNueva: false, id: '', publicadaEn: null };

      const manifiesto = resultado.manifest as { id?: string; createdAt?: string } | undefined;
      return {
        hayNueva: true,
        id: manifiesto?.id ?? '',
        publicadaEn: manifiesto?.createdAt ? new Date(manifiesto.createdAt) : null,
      };
    } catch {
      throw new ErrorActualizacion('No se pudo consultar las actualizaciones. Revisá la conexión a internet.');
    }
  }

  async descargarYReiniciar(): Promise<void> {
    if (!Updates.isEnabled) throw new ErrorActualizacion(SIN_SOPORTE);

    try {
      await Updates.fetchUpdateAsync();
    } catch {
      throw new ErrorActualizacion('No se pudo descargar la actualización. Probá de nuevo con buena conexión.');
    }
    await Updates.reloadAsync();
  }
}
