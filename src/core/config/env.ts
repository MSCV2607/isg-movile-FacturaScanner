/**
 * Mientras no exista el endpoint real, el envío y la prueba de conexión se simulan.
 * Con `true` el servidor "responde" 201 Created; si la URL configurada contiene la
 * palabra "fallo" responde 503 (sirve para ver la pantalla de error).
 * Pasar a `false` para usar el servidor real (fetch).
 */
export const USAR_SERVIDOR_SIMULADO = true;

/**
 * `true` devuelve una factura de ejemplo sin llamar a la IA (para probar las pantallas
 * sin API key). `false` analiza la foto de verdad.
 */
export const USAR_EXTRACTOR_SIMULADO = false;

/** Servicio de IA con visión que lee la factura. */
export const PROVEEDOR_IA: 'gemini' | 'anthropic' = 'gemini';

/** Modelos de cada servicio (se cambian acá si cambian los nombres). */
export const MODELO_GEMINI = 'gemini-3.8-flash';
/** Se usa si el modelo principal sigue fallando por sobrecarga. */
export const MODELO_GEMINI_RESPALDO = 'gemini-3.5-flash';
export const MODELO_ANTHROPIC = 'claude-sonnet-5-5';
