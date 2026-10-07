import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ActualizacionProvider } from '@presentation/state/ActualizacionContext';
import { FacturaEnCursoProvider } from '@presentation/state/FacturaEnCursoContext';

// Punto de entrada de las rutas (capa de presentación).
// Las rutas en src/app son finas: solo montan pantallas de @presentation.
export default function RootLayout() {
  return (
    <FacturaEnCursoProvider>
      <ActualizacionProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </ActualizacionProvider>
    </FacturaEnCursoProvider>
  );
}
