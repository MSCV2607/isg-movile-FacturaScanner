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
| `src/data/datasources/` | Acceso a fuentes externas (API HTTP, almacenamiento local). |
| `src/data/dtos/` | Formas de los datos tal como viajan por la red. |
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
