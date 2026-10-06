const TEXTOS: Record<number, string> = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

/** Android a veces devuelve el texto de estado vacío; se completa con el estándar. */
export function textoDeEstadoHttp(codigo: number, textoRecibido = ''): string {
  return textoRecibido.trim() !== '' ? textoRecibido : (TEXTOS[codigo] ?? '');
}
