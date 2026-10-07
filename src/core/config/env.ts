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

/** Cada cuánto, como máximo, se busca una versión nueva sola al volver a abrir la app. */
export const MINUTOS_ENTRE_BUSQUEDAS = 30;

/** Máximo de páginas que se pueden escanear de una sola vez (un ticket largo se recorre de a tramos). */
export const MAXIMO_PAGINAS_ESCANEO = 10;
/** Lado más largo (en píxeles) al que se reduce cada página antes de mandarla a leer. */
export const LADO_MAXIMO_PAGINA = 2000;
/** Calidad JPEG (0 a 1) de cada página: el texto se lee bien y varias páginas juntas siguen siendo livianas. */
export const CALIDAD_PAGINA = 0.7;

/**
 * Dirección del archivo JSON con los datos del último APK publicado (lo escribe el workflow
 * "Compilar APK"; ver docs/PUBLICACION.md). Vacío = la app no busca APK nuevos.
 */
export const URL_DATOS_APK: string =
  'https://gist.githubusercontent.com/MSCV2607/03a534b0bce19f58412cdc64764ebc77/raw/apk.json';
