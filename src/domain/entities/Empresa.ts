/** Empresa que puede usar la app, con la dirección de su api de autenticación. */
export interface Empresa {
  id: number;
  nombre: string;
  /** Url base de la api auth de la empresa. Vacía en la lista provisoria. */
  urlAuth: string;
}
