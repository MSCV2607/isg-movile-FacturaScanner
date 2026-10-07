/** Archivo JSON que publica el workflow "Compilar APK". Se valida al leerlo: no se confía en su forma. */
export type VersionApkDto = {
  version?: unknown;
  url?: unknown;
  publicadaEn?: unknown;
};
