export interface InstaladorApkDataSource {
  /** Descarga el APK y abre el instalador de Android. */
  descargarEInstalar(url: string): Promise<void>;
}
