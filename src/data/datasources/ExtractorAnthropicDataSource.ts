import { MODELO_ANTHROPIC } from '@core/config/env';
import { ErrorExtraccion } from '@core/errors/ErrorExtraccion';
import { ImagenFactura } from '@domain/entities/ImagenFactura';

import { FacturaExtraidaDto } from '../dtos/FacturaExtraidaDto';
import { ExtractorFacturaDataSource } from './ExtractorFacturaDataSource';
import { ESQUEMA, instruccionesPara } from './facturaPrompt';

const URL_API = 'https://api.anthropic.com/v1/messages';
const VERSION_API = '2023-06-01';
const TIEMPO_MAXIMO_MS = 60000;
const NOMBRE_HERRAMIENTA = 'registrar_factura';

function mensajeDeEstado(estado: number): string {
  if (estado === 401) return 'La API key no es válida. Revisala en Configuración.';
  if (estado === 403) return 'La API key no tiene permiso para usar este servicio.';
  if (estado === 413) return 'La foto es demasiado pesada. Probá de nuevo.';
  if (estado === 429) return 'Hay demasiadas consultas. Esperá un momento y probá de nuevo.';
  if (estado >= 500) return 'El servicio de IA no está disponible ahora. Probá de nuevo en un rato.';
  return `El servicio de IA rechazó la consulta (error ${estado}).`;
}

interface RespuestaAnthropic {
  content?: { type: string; input?: FacturaExtraidaDto }[];
}

/**
 * Lee la factura con un modelo de IA con visión, llamando directo a la API desde la app.
 * La clave viaja en el celular: sirve para probar, no para producción (ver docs/ARQUITECTURA.md).
 */
export class ExtractorAnthropicDataSource implements ExtractorFacturaDataSource {
  async extraer(imagenes: ImagenFactura[], apiKey: string): Promise<FacturaExtraidaDto> {
    if (imagenes.length === 0) throw new ErrorExtraccion('No hay fotos para analizar.');
    if (apiKey.trim() === '') {
      throw new ErrorExtraccion('Falta la API key de IA. Cargala en Configuración.');
    }

    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), TIEMPO_MAXIMO_MS);

    let respuesta: Response;
    try {
      respuesta = await fetch(URL_API, {
        method: 'POST',
        signal: control.signal,
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey.trim(),
          'anthropic-version': VERSION_API,
        },
        body: JSON.stringify({
          model: MODELO_ANTHROPIC,
          max_tokens: 4096,
          tools: [
            {
              name: NOMBRE_HERRAMIENTA,
              description: 'Registra los datos leídos de una factura.',
              input_schema: ESQUEMA,
            },
          ],
          tool_choice: { type: 'tool', name: NOMBRE_HERRAMIENTA },
          messages: [
            {
              role: 'user',
              content: [
                ...imagenes.map((imagen) => ({
                  type: 'image',
                  source: { type: 'base64', media_type: imagen.tipoMime, data: imagen.base64 },
                })),
                { type: 'text', text: `${instruccionesPara(imagenes.length)}\nRegistrá los datos con la herramienta ${NOMBRE_HERRAMIENTA}.` },
              ],
            },
          ],
        }),
      });
    } catch {
      throw new ErrorExtraccion('No se pudo conectar con el servicio de IA. Revisá tu conexión.');
    } finally {
      clearTimeout(temporizador);
    }

    if (!respuesta.ok) throw new ErrorExtraccion(mensajeDeEstado(respuesta.status));

    const cuerpo = (await respuesta.json()) as RespuestaAnthropic;
    const resultado = cuerpo.content?.find((bloque) => bloque.type === 'tool_use')?.input;
    if (!resultado) throw new ErrorExtraccion('La IA no devolvió datos. Probá de nuevo.');
    return resultado;
  }
}
