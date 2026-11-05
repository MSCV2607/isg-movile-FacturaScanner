/** Identifica esta instalación de la app: el auth la asocia al usuario para permitir o no el ingreso. */
export interface Instalacion {
  /** UUID generado la primera vez que se abre la app. */
  id: string;
  plataforma: 'android' | 'ios';
}
