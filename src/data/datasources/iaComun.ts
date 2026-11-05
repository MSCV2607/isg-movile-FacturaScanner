// Piezas comunes a los servicios de IA: errores, reintentos y llamada HTTP con tiempo máximo.
import { ErrorExtraccion } from '@core/errors/ErrorExtraccion';

export const TIEMPO_MAXIMO_MS = 60000;
const ESPERA_ENTRE_INTENTOS_MS = 1500;
const LARGO_MAXIMO_DETALLE = 160;

export interface ResultadoHttp<T> {
  estado: number;
  cuerpo: T;
}

/**
 * Conviene probar de nuevo (o con otro modelo) si el error es pasajero (sobrecarga, límite por minuto,
 * falla interna) o si el modelo no existe (404).
 */
export const esReintentable = (estado: number) => estado === 404 || estado === 429 || estado >= 500;

const esExito = (estado: number) => estado >= 200 && estado < 300;

function esperar(milisegundos: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, milisegundos));
}

/** POST con JSON y tiempo máximo. Distingue la falta de conexión de una respuesta demasiado lenta. */
export async function pedirJson<T>(url: string, headers: Record<string, string>, cuerpo: unknown): Promise<ResultadoHttp<T>> {
  const control = new AbortController();
  let vencio = false;
  const temporizador = setTimeout(() => {
    vencio = true;
    control.abort();
  }, TIEMPO_MAXIMO_MS);

  try {
    const respuesta = await fetch(url, {
      method: 'POST',
      signal: control.signal,
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(cuerpo),
    });
    const datos = (await respuesta.json().catch(() => ({}))) as T;
    return { estado: respuesta.status, cuerpo: datos };
  } catch {
    throw new ErrorExtraccion(
      vencio
        ? 'El servicio de IA tardó demasiado en responder. Probá de nuevo.'
        : 'No se pudo conectar con el servicio de IA. Revisá tu conexión.',
    );
  } finally {
    clearTimeout(temporizador);
  }
}

/**
 * Hace la consulta una vez por cada elemento de `intentos` (ej.: modelos) hasta que una responda bien.
 * Se detiene antes si el error no es pasajero. Devuelve el último resultado, sea bueno o malo.
 */
export async function reintentar<T>(
  intentos: readonly string[],
  consultar: (intento: string) => Promise<ResultadoHttp<T>>,
): Promise<ResultadoHttp<T>> {
  let ultimo: ResultadoHttp<T> = { estado: 0, cuerpo: {} as T };

  for (let indice = 0; indice < intentos.length; indice++) {
    if (indice > 0) await esperar(ESPERA_ENTRE_INTENTOS_MS);
    ultimo = await consultar(intentos[indice]);
    if (esExito(ultimo.estado) || !esReintentable(ultimo.estado)) break;
  }

  return ultimo;
}

export const huboExito = (resultado: ResultadoHttp<unknown>) => esExito(resultado.estado);

/** Mensaje para el usuario. Incluye el código y el motivo que informa el servicio para poder diagnosticar. */
export function mensajeDeEstadoIa(estado: number, detalle = ''): string {
  const motivo = detalle.trim().slice(0, LARGO_MAXIMO_DETALLE);
  const sufijo = ` (error ${estado}${motivo ? `: ${motivo}` : ''})`;

  if (/api key/i.test(motivo) || estado === 401) return 'La API key no es válida. Revisala en Configuración.';
  if (estado === 403) return `La API key no tiene permiso para usar este servicio${sufijo}.`;
  if (estado === 404) return `No se encontró el modelo de IA${sufijo}.`;
  if (estado === 413) return 'La foto es demasiado pesada. Probá de nuevo.';
  if (estado === 429) return `Se alcanzó el límite de consultas. Esperá un minuto y probá de nuevo${sufijo}.`;
  if (estado >= 500) return `El servicio de IA no está disponible ahora. Probá de nuevo en un rato${sufijo}.`;
  return `El servicio de IA rechazó la consulta${sufijo}.`;
}

/** Convierte el texto que devolvió la IA en JSON; tolera que lo envuelva en un bloque de código. */
export function leerJson<T>(texto: string): T {
  const limpio = texto.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try {
    return JSON.parse(limpio) as T;
  } catch {
    throw new ErrorExtraccion('La IA no devolvió datos legibles. Probá de nuevo con otra foto.');
  }
}

export const MENSAJE_RESPUESTA_CORTADA = 'La factura es demasiado larga para leerla de una vez. Probá con menos fotos.';
