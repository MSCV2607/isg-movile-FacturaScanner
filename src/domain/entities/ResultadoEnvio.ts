export interface ResultadoEnvio {
  exito: boolean;
  /** null cuando no hubo respuesta (sin conexión, tiempo agotado). */
  codigoHttp: number | null;
  textoHttp: string;
  /** Ruta del endpoint, por ejemplo "/api/facturas". */
  ruta: string;
}

export interface ResultadoConexion {
  exito: boolean;
  mensaje: string;
}
