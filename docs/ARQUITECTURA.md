# Arquitectura — ISG-FacturaScanner

Clean Architecture con cuatro carpetas dentro de `src/`, más las rutas de Expo Router en `src/app/`.

## Regla de dependencia

Las dependencias solo apuntan hacia adentro:

```
presentation  ──►  domain  ◄──  data
        \            ▲           /
         └─────►   core   ◄─────┘   (transversal: config, DI, errores, utils)
```

- `domain` no importa nada de React, Expo, ni de `data` / `presentation`. Es TypeScript puro.
- `data` implementa las interfaces que define `domain`.
- `presentation` usa los casos de uso de `domain`; nunca habla directo con `data`.
- `core` es transversal y no depende de ninguna otra capa (excepto la composición en `core/di`).

## Carpetas

| Carpeta | Qué va acá |
|---|---|
| `src/app/` | Rutas de Expo Router. Archivos finos que solo montan una pantalla de `presentation`. |
| `src/domain/entities/` | Modelos del negocio (por ejemplo, `Factura`). |
| `src/domain/repositories/` | Interfaces (contratos) de los repositorios. |
| `src/domain/rules/` | Reglas de negocio puras y compartidas (CUIT, comparación de comprobantes, períodos, búsqueda de texto). Sin acceso a datos. |
| `src/domain/usecases/` | Casos de uso: una acción de negocio por archivo. |
| `src/data/datasources/` | Acceso a fuentes externas: IA, base SQLite, archivos del celular, armado de Excel, CSV y PDF. |
| `src/data/dtos/` | Formas de los datos tal como vienen de afuera (respuesta de la IA, filas de SQLite). |
| `src/data/mappers/` | Conversión DTO ⇄ entidad. |
| `src/data/repositories/` | Implementaciones concretas de las interfaces de `domain`. |
| `src/presentation/screens/` | Pantallas (una por carpeta, con su lógica de vista). |
| `src/presentation/components/` | Componentes de UI reutilizables. |
| `src/presentation/hooks/` | Hooks que conectan la UI con los casos de uso. |
| `src/presentation/theme/` | Colores, tipografía y espaciado de la marca. |
| `src/core/config/` | Configuración (URL del endpoint, constantes). |
| `src/core/di/` | Composición de dependencias (quién usa qué implementación). |
| `src/core/errors/` | Errores comunes de la app. |
| `src/core/utils/` | Utilidades sin lógica de negocio. |

## Alias de importación

Definidos en `tsconfig.json`: `@/*`, `@core/*`, `@domain/*`, `@data/*`, `@presentation/*`.

## Plan de trabajo

Se construye de a una pantalla por vez. Cada pantalla recorre las capas de adentro hacia afuera:
entidad → contrato → caso de uso → implementación de datos → pantalla.

## Datos guardados en el celular

Cada factura que el usuario confirma en "Revisar datos" se guarda en el celular (`FacturaLocalRepository`):

- **Datos:** base SQLite `facturas.db` (`expo-sqlite`), con las tablas `facturas`, `factura_items` y `factura_fotos`
  (la migración 2 agregó la columna `categoria` e índices por comprobante y por fecha).
  El esquema se actualiza con migraciones numeradas (`PRAGMA user_version`) en `FacturaSqliteDataSource`:
  para cambiar la base se agrega una migración nueva al final, nunca se edita una anterior.
- **Fotos originales:** archivos `facturas/<id>/foto-N.jpg` en la carpeta privada de la app (`expo-file-system`);
  la base guarda solo la ruta relativa. Si falla el guardado de las fotos, se deshace también el de los datos.
- **Historial y detalle:** Inicio lista las últimas facturas guardadas y cada una abre `Detalle de factura`
  (`/detalle/[id]`), desde donde se exporta a Excel (`xlsx`), se descargan las fotos o se comparte (`expo-sharing`).

## Revisión de la factura

Al revisar una factura, antes de guardarla (`useFormularioFactura`, `useGuardarFactura`):

- **Validaciones locales:** `ValidarFacturaUseCase` bloquea el guardado (CUIT, fecha, importes) y
  `RevisarCoherenciaFacturaUseCase` solo avisa: si `neto + IVA` no da el `total` (tolerancia de 5 centavos) se muestra una nota
  en el campo Total. El CUIT usa la regla `domain/rules/cuit.ts` y muestra "CUIT válido" mientras se escribe.
- **Autocompletar con el historial:** con un CUIT válido, `BuscarEmisorConocidoUseCase` toma la factura guardada más reciente de ese
  emisor y completa razón social, condición fiscal y categoría, **solo en los campos vacíos**. Esos campos quedan marcados
  "De tu historial" hasta que el usuario los toca.
- **Duplicados:** `BuscarFacturaDuplicadaUseCase` busca por CUIT + punto de venta + número (índice `idx_facturas_comprobante`)
  y compara tipo y letra sin mirar mayúsculas ni tildes. Si ya existe, `DuplicadoDialog` muestra las dos lado a lado y deja elegir
  entre ver la guardada, guardar igual o volver a revisar.
- **Ítems editables:** se pueden corregir, borrar o agregar desde `ItemEditorSheet`. Los totales de la factura **no** se recalculan
  solos (pueden incluir otros tributos): el aviso de coherencia ayuda a detectar diferencias.
- **Categoría:** cada factura tiene un rubro opcional (`src/core/config/categorias.ts`) que alimenta el resumen.

## Historial, resumen y exportación

Tres pantallas nuevas, todas sobre las facturas guardadas en el celular:

| Ruta | Qué hace |
|---|---|
| `/historial` | Lista completa con búsqueda sin tildes (razón social, CUIT, número, categoría), filtro por período y total en pesos de lo que se ve. Se llega con "Ver todo" en Inicio. |
| `/resumen` | Gasto de un mes por categoría y principales proveedores (`ResumirPeriodoUseCase`), con navegación entre meses. |
| `/exportar` | Listado de un período en Excel, CSV o PDF, con o sin fotos. |

Reglas del resumen y de los listados: solo se suman facturas en pesos (`ARS`; las de otra moneda se avisan aparte) y las
notas de crédito restan. Los períodos (`Este mes`, `Mes anterior`, `Últimos 3 meses`, `Todo`) se calculan en `domain/rules/periodos.ts`.

Exportación (`ExportarPeriodoUseCase` + `ExportadorReporteRepository`):

- **Sin fotos:** se genera el archivo y se abre el menú de compartir; también se puede guardar en una carpeta.
- **Con fotos:** se elige una carpeta, se guarda el listado y las fotos originales en una subcarpeta `Fotos`.
- **Excel** (`xlsx`): hoja "Facturas", una fila por comprobante y una fila de total. **CSV:** UTF-8 con BOM, separador `;` y coma decimal
  (para abrirlo directo en Excel en español). **PDF** (`pdf-lib`, JavaScript puro): A4 apaisado, encabezado repetido en cada hoja;
  los caracteres que la fuente estándar no soporta se reemplazan por `?`.

## Pendiente: servidor

La conexión con el servidor (URL, token y envío del JSON) se quitó de Configuración y del flujo.
El código quedó en el proyecto (`EnviarFacturaUseCase`, `ServidorRepository`, `ProbarConexionUseCase`)
para retomarlo más adelante, cuando exista el endpoint que inserta en la base de datos real.
El envío por correo (a uno mismo o a otra persona) es solo visual: muestra "Próximamente".

## Actualizaciones de la app

La app se actualiza sola con **EAS Update** (`expo-updates`), sin reinstalar el APK (`ActualizacionRepository`):

- **Publicar:** cada push/merge a `develop` dispara `.github/workflows/actualizar-develop.yml`, que verifica los tipos y publica
  la actualización en el canal `preview` (`eas update`).
- **Cuándo busca la app:** al abrirse y al volver a ella (como máximo cada `MINUTOS_ENTRE_BUSQUEDAS`, 30 por defecto), y cuando el usuario toca
  **Buscar actualizaciones** en Configuración. La búsqueda automática de `expo-updates` está apagada (`checkAutomaticallyOnLaunch: NEVER`)
  porque es la app la que le pregunta al usuario.
- **Cartel:** si hay una actualización, aparece "Hay una actualización" con **Actualizar ahora** / **Ahora no**. Con "Actualizar ahora" se descarga
  y la app se reinicia sola. Con "Ahora no", esa actualización no se vuelve a ofrecer sola hasta la próxima apertura.
- **Alcance:** solo cambia el código de la app (pantallas, lógica). Un APK nuevo hace falta si cambian librerías nativas, permisos, íconos
  o el `version` de `app.json` (la actualización solo llega a APK con el mismo `version`: `runtimeVersion` = `appVersion`).
- **Expo Go:** no sirve para probar esto; solo la app instalada desde el APK. En Expo Go el botón avisa que no está disponible.
- Pasos de puesta en marcha y comandos: `docs/PUBLICACION.md`.

## Lectura combinada: QR de ARCA + IA

Al escanear, el QR de ARCA se busca sobre las páginas ya recortadas (ver "Escaneo de documentos").
`LeerFacturaUseCase` combina las dos lecturas:

- **Con QR:** CUIT, punto de venta, número, fecha, total, moneda, tipo y letra salen del QR (`LeerQrFacturaUseCase`, que decodifica
  `https://www.afip.gob.ar/fe/qr/?p=<JSON en base64>`). La IA completa razón social, condición fiscal e ítems. Si la IA había leído un dato
  distinto del QR, la revisión lo avisa debajo del campo ("La IA había leído …").
- **Sin QR** (tickets no fiscales, facturas viejas o del exterior): la IA lee todo.
- **Si la IA falla pero hay QR:** se cargan los datos del QR, aparece un aviso en la revisión y el usuario completa a mano razón social,
  condición fiscal y neto/IVA (los ítems quedan vacíos).
- El QR no trae razón social, condición fiscal, ítems ni desglose de IVA, por eso la IA sigue siendo necesaria.

## Escaneo de documentos

La captura usa el escáner de documentos de Google (ML Kit Document Scanner, paquete `react-native-document-scanner-plugin`), el mismo que
usa Google Drive: detecta los bordes del papel, endereza, recorta, ofrece filtros y permite varias páginas en un mismo escaneo.

- **Capas:** `EscanearDocumentoUseCase` (dominio) pide las páginas a `EscanerDocumentosRepository`, que implementa
  `EscanerDocumentosMlKitDataSource` (datos). Del texto de los QR que se vieron elige el de ARCA con `LeerQrFacturaUseCase`.
- **Pantalla:** `ScannerScreen` abre el escáner solo al entrar y acompaña el resto (leyendo, error). Si el usuario cierra el escáner sin
  escanear, vuelve a la pantalla anterior. Si la lectura falla, se puede reintentar con las mismas páginas sin escanear de nuevo.
- **Imágenes:** cada página se reduce a `LADO_MAXIMO_PAGINA` y se comprime (`expo-image-manipulator`) antes de mandarla a la IA.
- **QR:** `expo-camera` (`scanFromURLAsync`) lo busca en la página entera y, si no aparece, en la mitad inferior y en sus dos cuartos
  (el de ARCA va casi siempre abajo).
- **Límites:** necesita Google Play Services y no funciona en Expo Go (el módulo se carga recién al escanear, así que el resto de la app
  sigue andando). El paquete es nativo: llega **con un APK nuevo**, no por actualización automática.
- Configuración en `core/config/env.ts`: `MAXIMO_PAGINAS_ESCANEO`, `LADO_MAXIMO_PAGINA`, `CALIDAD_PAGINA`.
