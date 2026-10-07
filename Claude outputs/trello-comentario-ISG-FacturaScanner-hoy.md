Avances / Implementación

* **Nueva funcionalidad:** las facturas escaneadas ahora se guardan en el celular (base de datos local SQLite) junto con sus fotos originales, y se pueden consultar y exportar desde una nueva pantalla de detalle. Antes, al confirmar una factura se armaba el envío a un servidor simulado y no quedaba nada guardado.
* **Cómo se usa:**
   * En la revisión, el botón pasó a ser **Guardar factura**; al guardar aparece "¡Factura guardada!" (o "No se pudo guardar" si falla).
   * En **Inicio**, "Últimos escaneos" muestra el historial real guardado (antes eran datos de ejemplo).
   * Al tocar una factura del historial se abre el **Detalle de factura**: datos del emisor y del comprobante, ítems e importes, y las fotos originales.
   * Desde el detalle se pueden **ver y descargar las fotos** originales a una carpeta elegida, **exportar la factura a Excel** (hojas "Factura" e "Ítems") y **compartirla** con las apps del celular, todo dentro de "Exportar y enviar".
   * "Enviarme por correo" y "Enviar a otra persona" están solo como botones visuales con el cartel "Próximamente"; todavía no envían nada.
* **Cambio de alcance:** se quitó la conexión al servidor (URL y token) de Configuración, que ahora solo tiene la API key de la IA y la cuenta. El código del servidor se dejó sin usar para retomarlo más adelante.
* **Impacto:** sin cambios en permisos ni integraciones existentes. Los datos quedan solo en el celular (no se envían a ningún servidor).
* **Configuración / instalación:** requiere ejecutar `npm install` (se agregaron las librerías de SQLite, archivos, compartir y Excel) y reiniciar con `npx expo start --clear`. La base se crea sola con migraciones numeradas en la primera apertura.
* **Validaciones:** chequeo de tipos y build de Android sin errores; guardado, lectura y exportación probados con módulos simulados. Prueba funcional en el celular con Expo Go: [completar resultado].
* **Limitaciones:**
   * El historial vive solo en el celular; si se desinstala la app o se borran sus datos, se pierde.
   * El envío por correo y el envío al servidor siguen pendientes.
* **Documentación:** decisiones y arquitectura actualizadas en el proyecto "APP Facturas" (`arquitectura-y-decisiones.md`).
