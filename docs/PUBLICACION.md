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

Si se agregan o actualizan librerías nativas, permisos o íconos, o si se cambia `version` en `app.json`, hace falta un APK nuevo.
Una actualización por aire solo llega a APK con el mismo `version`: **al cambiar algo nativo, subir `version`** (así los APK viejos no
reciben código que no pueden ejecutar). Si solo se tocó código en `src`, no se cambia `version`.

El historial, el resumen y la exportación (incluido el PDF con `pdf-lib`) son solo JavaScript: llegan por actualización por aire,
sin APK nuevo. La migración de SQLite se aplica sola la primera vez que se abre la app actualizada.

## APK nuevo automático

Al subir `version` en `app.json` y hacer merge a `develop`, el workflow **Compilar APK** (`.github/workflows/compilar-apk.yml`)
compila el APK en EAS y escribe sus datos (versión y link de descarga) en un gist secreto. Las apps instaladas leen ese archivo:
si hay una versión más nueva que la suya, muestran el cartel **"Hay una versión nueva de la app"**, descargan el APK y abren el
instalador de Android. Android no permite instalar en silencio: el usuario toca **Instalar**, y la primera vez debe permitir
instalar desde esta app.

Configuración única:

1. En https://gist.github.com crear un gist **secreto** con un archivo llamado `apk.json` y este contenido:
   `{"version": "0.0.0", "url": "https://expo.dev"}`. Copiar el ID del gist (el código largo al final de su dirección).
2. En GitHub → Settings → Developer settings → Personal access tokens (classic) → generar un token con el permiso **gist**.
3. En el repositorio → Settings → Secrets and variables → Actions, crear los secretos **`GIST_TOKEN`** (el token) y **`GIST_ID`** (el ID).
4. En `src/core/config/env.ts` completar `URL_DATOS_APK` con
   `https://gist.githubusercontent.com/<usuario>/<GIST_ID>/raw/apk.json`.

Notas:

- La primera instalación con esta función se hace a mano (`npm run build:apk`); desde esa versión en adelante se ofrecen solas.
- Cada compilación del perfil `preview` sube el `versionCode` de Android (`autoIncrement` en `eas.json`), requisito para que el
  instalador acepte la versión nueva encima de la anterior.
- EAS conserva el APK unos 30 días: alcanza para que los celulares ya instalados lo descarguen cuando se publica.
