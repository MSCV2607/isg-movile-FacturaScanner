# ISG-FacturaScanner

App móvil (Android) para escanear el código QR de una factura, armar un JSON con sus datos y enviarlo a un endpoint que lo guarda en la base.

Stack: React Native con Expo (SDK 57), TypeScript y Expo Router. Arquitectura: ver [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md).

## Primeros pasos

```bash
npm install
npm run typecheck   # verifica los tipos
npm start           # levanta el servidor de desarrollo
```

## Generar el APK para instalar con un QR

La compilación se hace en la nube con EAS Build, sin Android Studio.

```bash
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest build --platform android --profile preview
```

Al terminar, EAS entrega un link y un código QR de descarga del APK. Quien escanee el QR con el celular puede instalar la app.

Notas:

- El perfil `preview` (en `eas.json`) genera un APK de distribución interna.
- La primera vez Android pide permitir "instalar apps de orígenes desconocidos".
- El identificador de la app es `com.intersistemas.facturascanner` (en `app.json`). Conviene confirmarlo antes del primer build, porque cambiarlo después implica una app distinta.
