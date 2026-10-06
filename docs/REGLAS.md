# Reglas del proyecto

1. **Calma: una pantalla por vez.** No se adelanta trabajo de pantallas futuras.
2. **Código legible y modularizado**, siguiendo Clean Architecture (ver `ARQUITECTURA.md`).
3. **Cada pantalla y componente tiene su archivo de estilos** `Nombre.styles.ts` (`StyleSheet.create`). React Native no soporta CSS nativo, por eso no se usa `.module.css`.
4. **Sin estilos en línea** (`style={{ ... }}`) ni colores hexadecimales dentro de los `.tsx`: todo sale del tema (`@presentation/theme`).
5. Las rutas de `src/app` son finas: solo renderizan la pantalla de `presentation/screens`.
6. La composición de dependencias vive en `core/di/container.ts`.
7. Se prueba con Expo Go (`npm start`), sin compilaciones EAS.
8. **Servidor simulado:** mientras no haya endpoint real, `core/config/env.ts` tiene `USAR_SERVIDOR_SIMULADO = true`. Pasarlo a `false` para enviar de verdad con `fetch`.
