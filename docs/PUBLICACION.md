# Generar el APK y publicar actualizaciones

Se sigue el mismo esquema que `micasa-app-mscv`: el APK se compila **una vez** con EAS y después cada merge a `develop`
publica una actualización por aire (EAS Update) desde un runner de GitHub (`ubuntu-latest`; no hace falta runner propio).

## Configuración única (una sola vez)

En la carpeta del proyecto:

```bash
npx expo install expo-updates      # agrega la librería de actualizaciones
npx eas-cli login                  # cuenta de expo.dev
npx eas-cli init                   # crea el proyecto en EAS y guarda projectId y owner en app.json
npx eas-cli update:configure       # guarda la URL de actualizaciones y el runtimeVersion en app.json
```

Hacer commit de `app.json`, `eas.json`, `package.json` y `package-lock.json`.

En GitHub (repositorio → Settings → Secrets and variables → Actions) crear el secreto **`EXPO_TOKEN`**:
token de expo.dev → Account settings → Access tokens → Create token.

## Compilar el APK

```bash
npm run build:apk
```

(equivale a `npx eas-cli build -p android --profile preview`). Compila en la nube de EAS, sin Android Studio. Al terminar
muestra un link y un QR para descargar el `.apk`; se instala en el celular (Android pide permitir instalar desde esa fuente).
EAS guarda la firma de la app: los APK siguientes usan la misma, así se pueden instalar encima del anterior.

El APK se compila **después** de `update:configure`, para que ya traiga la URL y el canal `preview`.

## Publicar actualizaciones

- **Automático:** merge o push a `develop` → el workflow publica la actualización. Los celulares con el APK la ofrecen al abrir la app
  (cartel "Hay una actualización") o desde Configuración → **Buscar actualizaciones**.
- **Manual (sin pasar por GitHub):** `npm run update -- "Descripción del cambio"`.

## Cuándo hace falta un APK nuevo

Si se agregan o actualizan librerías nativas, permisos o íconos, o si se cambia `version` en `app.json`:
volver a ejecutar `npm run build:apk` e instalar el nuevo APK. Una actualización solo llega a APK con el mismo `version`.
