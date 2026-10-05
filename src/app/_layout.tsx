import { Stack } from 'expo-router';

// Capa de presentación (punto de entrada de rutas).
// Las rutas en src/app son finas: solo montan pantallas de @presentation.
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
