import { MODELO_GEMINI, MODELO_GEMINI_RESPALDO } from '@core/config/env';
import { ErrorExtraccion } from '@core/errors/ErrorExtraccion';
import { ImagenFactura } from '@domain/entities/ImagenFactura';

import { FacturaExtraidaDto } from '../dtos/FacturaExtraidaDto';
import { ExtractorFacturaDataSource } from './ExtractorFacturaDataSource';
import { ESQUEMA, instruccionesPara } from './facturaPrompt';
import {
  huboExito,
  leerJson,
  MENSAJE_RESPUESTA_CORTADA,
  mensajeDeEstadoIa,
  pedirJson,
  reintentar,
} from './iaComun';

const URL_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Intentos en orden: el modelo principal dos veces y, si sigue fallando, el de respaldo.
const MODELOS_A_INTENTAR = [MODELO_GEMINI, MODELO_GEMINI, MODELO_GEMINI_RESPALDO];

interface RespuestaGemini {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
}

/**
 * Lee la factura con Gemini, llamando directo a la API desde la app (API generateContent).
 * La clave viaja en el celular: sirve para probar, no para producción (ver docs/ARQUITECTURA.md).
 */
export class ExtractorGeminiDataSource implements ExtractorFacturaDataSource {
  async extraer(imagenes: ImagenFactura[], apiKey: string, correcciones: string[] = []): Promise<FacturaExtraidaDto> {
    if (imagenes.length === 0) throw new ErrorExtraccion('No hay fotos para analizar.');
    if (apiKey.trim() === '') {
      throw new ErrorExtraccion('Falta la API key de IA. Cargala en Configuración.');
    }

    const resultado = await reintentar<RespuestaGemini>(MODELOS_A_INTENTAR, (modelo) =>
      pedirJson<RespuestaGemini>(
        `${URL_BASE}/${modelo}:generateContent`,
        { 'x-goog-api-key': apiKey.trim() },
        {
          contents: [
            {
              parts: [
                { text: instruccionesPara(imagenes.length, correcciones) },
                ...imagenes.map((imagen) => ({ inline_data: { mime_type: imagen.tipoMime, data: imagen.base64 } })),
              ],
            },
          ],
          generationConfig: { responseMimeType: 'application/json', responseSchema: ESQUEMA },
        },
      ),
    );

    if (!huboExito(resultado)) {
      throw new ErrorExtraccion(mensajeDeEstadoIa(resultado.estado, resultado.cuerpo.error?.message ?? ''));
    }
    return this.leerDatos(resultado.cuerpo);
  }

  private leerDatos(cuerpo: RespuestaGemini): FacturaExtraidaDto {
    if (cuerpo.promptFeedback?.blockReason) {
      throw new ErrorExtraccion('La IA no pudo procesar esta imagen. Probá con otra foto.');
    }

    const candidato = cuerpo.candidates?.[0];
    const texto = (candidato?.content?.parts ?? []).map((parte) => parte.text ?? '').join('');

    if (candidato?.finishReason === 'MAX_TOKENS') throw new ErrorExtraccion(MENSAJE_RESPUESTA_CORTADA);
    return leerJson<FacturaExtraidaDto>(texto);
  }
}
