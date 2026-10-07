import { formatearFechaHora } from '@core/utils/formatters';
import { NovedadApp } from '@domain/entities/NovedadApp';

export interface TextosCartel {
  titulo: string;
  mensaje: string;
  pista: string;
  accion: string;
}

/** Textos del cartel de actualización: cambian si es solo código (por aire) o un APK nuevo que hay que instalar. */
export function textosDelCartel(novedad: NovedadApp | null, versionInstalada: string): TextosCartel {
  if (novedad?.tipo === 'apk') {
    return {
      titulo: 'Hay una versión nueva de la app',
      mensaje: `Ya está disponible la versión ${novedad.version.version} (tenés la ${versionInstalada}). ¿Querés instalarla ahora?`,
      pista:
        'Se descarga y Android te pide confirmar la instalación. La primera vez tenés que permitir instalar desde esta app. No perdés tus facturas guardadas.',
      accion: 'Descargar e instalar',
    };
  }

  const publicadaEn = novedad?.tipo === 'codigo' ? novedad.actualizacion.publicadaEn : null;
  return {
    titulo: 'Hay una actualización',
    mensaje: publicadaEn
      ? `Se publicó una versión nueva de la app el ${formatearFechaHora(publicadaEn)}. ¿Querés actualizar ahora?`
      : 'Se publicó una versión nueva de la app. ¿Querés actualizar ahora?',
    pista: 'Se descarga y la app se reinicia sola. No perdés tus facturas guardadas.',
    accion: 'Actualizar ahora',
  };
}
