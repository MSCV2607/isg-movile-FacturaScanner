import { VersionApk } from '@domain/entities/VersionApk';

import { VersionApkDto } from '../dtos/VersionApkDto';

const VERSION_VALIDA = /^\d+(\.\d+){0,2}$/;

/** Devuelve el APK si los datos son válidos (versión numérica y dirección https); si no, null. */
export function versionApkDesdeDto(dto: VersionApkDto): VersionApk | null {
  if (typeof dto !== 'object' || dto === null) return null;
  if (typeof dto.version !== 'string' || !VERSION_VALIDA.test(dto.version)) return null;
  if (typeof dto.url !== 'string' || !dto.url.startsWith('https://')) return null;

  const fecha = typeof dto.publicadaEn === 'string' ? new Date(dto.publicadaEn) : null;
  return {
    version: dto.version,
    url: dto.url,
    publicadaEn: fecha && !Number.isNaN(fecha.getTime()) ? fecha : null,
  };
}
