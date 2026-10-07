/** Un APK de la app ya compilado y listo para descargar e instalar. */
export interface VersionApk {
  /** Versión de la app que trae ese APK, por ejemplo "1.2.0". */
  version: string;
  /** Dirección desde donde se descarga el APK. */
  url: string;
  /** Cuándo se compiló (null si no se sabe). */
  publicadaEn: Date | null;
}
