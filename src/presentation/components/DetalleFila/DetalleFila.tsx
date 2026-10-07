import { Text, View } from 'react-native';

import { styles } from './DetalleFila.styles';

type DetalleFilaProps = {
  etiqueta: string;
  valor: string;
};

export function DetalleFila({ etiqueta, valor }: DetalleFilaProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{etiqueta}</Text>
      <Text style={styles.value}>{valor}</Text>
    </View>
  );
}
