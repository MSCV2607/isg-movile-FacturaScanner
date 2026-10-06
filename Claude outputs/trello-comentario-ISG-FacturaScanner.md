Avances / Implementación

* Se desarrolló la app móvil Android **ISG-FacturaScanner** (React Native + Expo, probada con Expo Go) para fotografiar una factura, extraer sus datos con IA y enviarlos a un endpoint. Se reemplazó la lectura del QR prevista inicialmente por la lectura de la foto con Gemini, porque el QR no trae todos los datos necesarios. Se extraen:
   * Razón social, CUIT y condición fiscal del emisor.
   * Punto de venta, número de comprobante y fecha de emisión.
   * Ítems, IVA e importes (neto, IVA y total).
* Pantallas incluidas: login (ingreso simulado), Inicio, escáner, revisión, envío exitoso, envío con error y Configuración (URL y token del servidor, API key de la IA).
* Escaneo de tickets largos: en el escáner se elige el modo **Automático** (la app saca una foto cada ~1,2 s mientras se baja por el ticket) o **Manual** (una foto por tramo). Las fotos (máximo 10) se envían juntas a la IA, que las une en una sola factura sin repetir ítems. Si el análisis falla, las fotos se conservan para reintentar.
* La pantalla de revisión muestra los datos editables y los valida antes de enviar: CUIT con dígito verificador, fecha e importes. Al enviar se arma un JSON y se hace un POST al endpoint configurado.
* Se agregó reintento automático ante errores pasajeros de Gemini, con modelo de respaldo, y mensajes de error que indican el motivo.
* Impacto: es una app nueva, sin cambios en permisos, datos ni integraciones existentes. Todavía no inserta datos en una base real.
* Diferencia respecto del requerimiento original: se cambió la lectura del QR por extracción de datos desde la foto con IA, y se sumó el escaneo con varias fotos para tickets largos.
* Validaciones realizadas:
   * Chequeo de tipos y build de Android sin errores.
   * Lógica de lectura probada con respuestas simuladas: JSON válido, reintentos y modelo de respaldo, API key inválida, imagen bloqueada, y envío de una foto y de varias fotos.
   * Prueba funcional en dispositivo con Expo Go: [completar resultado].
* Consideraciones conocidas:
   * La API key de Gemini se carga en Configuración y queda guardada en el celular. Sirve como prueba de concepto; para producción la lectura debería pasar al backend .NET.
   * El servidor está simulado (`USAR_SERVIDOR_SIMULADO = true`). Falta definir el endpoint que inserta en la base y cambiar ese valor a `false`.
   * Los nombres de los modelos de IA se configuran en `src/core/config/env.ts`.
   * "Últimos envíos" en Inicio muestra datos de ejemplo, no un historial real.
   * La calidad de la lectura depende de las fotos: buena luz, celular firme y bajar despacio por el ticket.
* Documentación actualizada: decisiones y arquitectura en el proyecto "APP Facturas" (`arquitectura-y-decisiones.md`).
