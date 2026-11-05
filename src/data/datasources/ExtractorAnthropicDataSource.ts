import { MODELO_ANTHROPIC } from '@core/config/env';
import { ErrorExtraccion } from '@core/errors/ErrorExtraccion';
import { ImagenFactura } from '@domain/entities/ImagenFactura';

import { FacturaExtraidaDto } from '../dtos/FacturaExtraidaDto';
import { ExtractorFacturaDataSource } from './ExtractorFacturaDataSource';
import { ESQUEMA, instruccionesPara } from './facturaPrompt';
import { huboExito, MENSAJE_RESPUESTA_CORTADA, mensajeDeEstadoIa, pedirJson, reintentar } from './iaComun';

const URL_API = 'https://api.anthropic.com/v1/messages';
const VERSION_API = '2023-06-01';
const NOMBRE_HERRAMIENTA = 'registrar_factura';
const MAXIMO_TOKENS = 8192;

// Dos intentos con el mismo modelo ante una sobrecarga o un límite por minuto.
const INTENTOS = [MODELO_ANTHROPIC, MODELO_ANTHROPIC];

interface RespuestaAnthropic {
  content?: { type: string; input?: FacturaExtraidaDto }[];
  stop_reason?: string;
  error?: { message?: string };
}

/**
 * Lee la factura con un modelo de IA con visión, llamando directo a la API desde la app.
 * La clave viaja en el celular: sirve para probar, no para producción (ver docs/ARQUITECTURA.md).
 */
export class ExtractorAnthropicDataSource implements ExtractorFacturaDataSource {
  async extraer(imagenes: ImagenFactura[], apiKey: string, correcciones: string[] = []): Promise<FacturaExtraidaDto> {
    if (imagenes.length === 0) throw new ErrorExtraccion('No hay fotos para analizar.');
    if (apiKey.trim() === '') {
      throw new ErrorExtraccion('Falta la API key de IA. Cargala en Configuración.');
    }

    const texto = `${instruccionesPara(imagenes.length, correcciones)}\nRegistrá los datos con la herramienta ${NOMBRE_HERRAMIENTA}.`;

    const resultado = await reintentar<RespuestaAnthropic>(INTENTOS, (modelo) =>
      pedirJson<RespuestaAnthropic>(
        URL_API,
        { 'x-api-key': apiKey.trim(), 'anthropic-version': VERSION_API },
        {
          model: modelo,
          max_tokens: MAXIMO_TOKENS,
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
                { type: 'text', text: texto },
              ],
            },
          ],
        },
      ),
    );

    if (!huboExito(resultado)) {
      throw new ErrorExtraccion(mensajeDeEstadoIa(resultado.estado, resultado.cuerpo.error?.message ?? ''));
    }

    const cuerpo = resultado.cuerpo;
    if (cuerpo.stop_reason === 'max_tokens') throw new ErrorExtraccion(MENSAJE_RESPUESTA_CORTADA);

    const datos = cuerpo.content?.find((bloque) => bloque.type === 'tool_use')?.input;
    if (!datos) throw new ErrorExtraccion('La IA no devolvió datos. Probá de nuevo.');
    return datos;
  }
}
