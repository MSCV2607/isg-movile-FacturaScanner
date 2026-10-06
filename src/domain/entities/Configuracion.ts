/** Datos para conectarse al servidor que recibe las facturas y al servicio de IA que las lee. */
export interface Configuracion {
  endpointUrl: string;
  token: string;
  /** Clave del servicio de IA que lee la foto de la factura. */
  apiKeyIa: string;
}

export type ErroresConfiguracion = Partial<Record<keyof Configuracion, string>>;
