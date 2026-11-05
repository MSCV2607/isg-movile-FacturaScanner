/** Sesión iniciada: la guarda la app para usarla después contra las apis de la empresa. */
export interface Sesion {
  token: string;
  /** Fecha y hora (ISO) hasta la que el token es válido. */
  validoHasta: string;
  empresa: string;
  urlAuth: string;
  usuario: string;
}
