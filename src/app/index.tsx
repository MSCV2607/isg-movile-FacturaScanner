import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@presentation/theme';

// Ruta provisoria: Expo Router necesita al menos una ruta para arrancar.
// Se reemplaza en el paso de la pantalla de Login.
export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Hola mundo!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryDark,
  },
});
