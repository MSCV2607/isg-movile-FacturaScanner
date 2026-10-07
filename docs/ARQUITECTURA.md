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
| `src/domain/usecases/` | Casos de uso: una acción de negocio por archivo. |
| `src/data/datasources/` | Acceso a fuentes externas: IA, base SQLite, archivos del celular, armado del Excel. |
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

- **Datos:** base SQLite `facturas.db` (`expo-sqlite`), con las tablas `facturas`, `factura_items` y `factura_fotos`.
  El esquema se actualiza con migraciones numeradas (`PRAGMA user_version`) en `FacturaSqliteDataSource`:
  para cambiar la base se agrega una migración nueva al final, nunca se edita una anterior.
- **Fotos originales:** archivos `facturas/<id>/foto-N.jpg` en la carpeta privada de la app (`expo-file-system`);
  la base guarda solo la ruta relativa. Si falla el guardado de las fotos, se deshace también el de los datos.
- **Historial y detalle:** Inicio lista las últimas facturas guardadas y cada una abre `Detalle de factura`
  (`/detalle/[id]`), desde donde se exporta a Excel (`xlsx`), se descargan las fotos o se comparte (`expo-sharing`).

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
