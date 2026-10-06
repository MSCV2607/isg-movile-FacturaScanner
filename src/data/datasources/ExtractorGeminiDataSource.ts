import { MODELO_GEMINI, MODELO_GEMINI_RESPALDO } from '@core/config/env';
import { ErrorExtraccion } from '@core/errors/ErrorExtraccion';
import { ImagenFactura } from '@domain/entities/ImagenFactura';

import { FacturaExtraidaDto } from '../dtos/FacturaExtraidaDto';
import { ExtractorFacturaDataSource } from './ExtractorFacturaDataSource';
import { ESQUEMA, instruccionesPara } from './facturaPrompt';

const URL_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const TIEMPO_MAXIMO_MS = 60000;
const ESPERA_ENTRE_INTENTOS_MS = 1500;
const LARGO_MAXIMO_DETALLE = 160;

// Intentos en orden: el modelo principal dos veces y, si sigue fallando, el de respaldo.
const MODELOS_A_INTENTAR = [MODELO_GEMINI, MODELO_GEMINI, MODELO_GEMINI_RESPALDO];

/**
 * Conviene probar de nuevo (o con el modelo de respaldo) si el error es pasajero (sobrecarga,
 * límite por minuto, falla interna) o si el modelo no existe (404).
 */
const esReintentable = (estado: number) => estado === 404 || estado === 429 || estado >= 500;

interface RespuestaGemini {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
}

interface ResultadoIntento {
  estado: number;
  cuerpo: RespuestaGemini;
}

function esperar(milisegundos: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, milisegundos));
}

/** Mensaje para el usuario. Incluye el código y el motivo que informa Google para poder diagnosticar. */
function mensajeDeEstado(estado: number, detalle: string): string {
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

/**
 * Lee la factura con Gemini, llamando directo a la API desde la app (API generateContent).
 * La clave viaja en el celular: sirve para probar, no para producción (ver docs/ARQUITECTURA.md).
 */
export class ExtractorGeminiDataSource implements ExtractorFacturaDataSource {
  async extraer(imagenes: ImagenFactura[], apiKey: string): Promise<FacturaExtraidaDto> {
    if (imagenes.length === 0) throw new ErrorExtraccion('No hay fotos para analizar.');
    if (apiKey.trim() === '') {
      throw new ErrorExtraccion('Falta la API key de IA. Cargala en Configuración.');
    }

    let ultimo: ResultadoIntento = { estado: 0, cuerpo: {} };

    for (let intento = 0; intento < MODELOS_A_INTENTAR.length; intento++) {
      if (intento > 0) await esperar(ESPERA_ENTRE_INTENTOS_MS);

      ultimo = await this.pedir(MODELOS_A_INTENTAR[intento], imagenes, apiKey.trim());
      if (ultimo.estado >= 200 && ultimo.estado < 300) return this.leerDatos(ultimo.cuerpo);
      if (!esReintentable(ultimo.estado)) break;
    }

    throw new ErrorExtraccion(mensajeDeEstado(ultimo.estado, ultimo.cuerpo.error?.message ?? ''));
  }

  private async pedir(modelo: string, imagenes: ImagenFactura[], apiKey: string): Promise<ResultadoIntento> {
    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), TIEMPO_MAXIMO_MS);

    try {
      const respuesta = await fetch(`${URL_BASE}/${modelo}:generateContent`, {
        method: 'POST',
        signal: control.signal,
        headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: instruccionesPara(imagenes.length) },
                ...imagenes.map((imagen) => ({ inline_data: { mime_type: imagen.tipoMime, data: imagen.base64 } })),
              ],
            },
          ],
          generationConfig: { responseMimeType: 'application/json', responseSchema: ESQUEMA },
        }),
      });
      const cuerpo = (await respuesta.json().catch(() => ({}))) as RespuestaGemini;
      return { estado: respuesta.status, cuerpo };
    } catch {
      throw new ErrorExtraccion('No se pudo conectar con el servicio de IA. Revisá tu conexión.');
    } finally {
      clearTimeout(temporizador);
    }
  }

  private leerDatos(cuerpo: RespuestaGemini): FacturaExtraidaDto {
    if (cuerpo.promptFeedback?.blockReason) {
      throw new ErrorExtraccion('La IA no pudo procesar esta imagen. Probá con otra foto.');
    }

    const texto = (cuerpo.candidates?.[0]?.content?.parts ?? []).map((parte) => parte.text ?? '').join('');

    try {
      return JSON.parse(texto) as FacturaExtraidaDto;
    } catch {
      throw new ErrorExtraccion('La IA no devolvió datos legibles. Probá de nuevo con otra foto.');
    }
  }
}
