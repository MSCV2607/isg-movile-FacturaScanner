import { Text, View } from 'react-native';

import { styles } from './DetalleTecnico.styles';

type DetalleTecnicoProps = {
  mensaje: string;
};

export function DetalleTecnico({ mensaje }: DetalleTecnicoProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Detalle técnico</Text>
      <Text style={styles.response}>{mensaje}</Text>
    </View>
  );
}
