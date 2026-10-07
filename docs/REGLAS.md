# Reglas del proyecto

1. **Calma: una pantalla por vez.** No se adelanta trabajo de pantallas futuras.
2. **Código legible y modularizado**, siguiendo Clean Architecture (ver `ARQUITECTURA.md`).
3. **Cada pantalla y componente tiene su archivo de estilos** `Nombre.styles.ts` (`StyleSheet.create`). React Native no soporta CSS nativo, por eso no se usa `.module.css`.
4. **Sin estilos en línea** (`style={{ ... }}`) ni colores hexadecimales dentro de los `.tsx`: todo sale del tema (`@presentation/theme`).
5. Las rutas de `src/app` son finas: solo renderizan la pantalla de `presentation/screens`.
6. La composición de dependencias vive en `core/di/container.ts`.
7. Se prueba con Expo Go (`npm start`), sin compilaciones EAS.
8. **Persistencia local:** las facturas se guardan en SQLite (datos) y en archivos (fotos). Los cambios de esquema se hacen agregando una migración al final de `FacturaSqliteDataSource`, sin editar las anteriores.
9. **Servidor pendiente:** la conexión con el servidor está fuera del flujo hasta que exista el endpoint (`USAR_SERVIDOR_SIMULADO` sigue en `true` para cuando se retome).
