import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@presentation/theme';

import { styles } from './AvisoLectura.styles';

type AvisoLecturaProps = {
  mensaje: string;
};

/** Cartel de la pantalla de revisión: algo que el usuario debe saber de cómo se leyó la factura. */
export function AvisoLectura({ mensaje }: AvisoLecturaProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Ionicons name="alert-circle-outline" size={20} color={colors.warningText} />
      <Text style={styles.text}>{mensaje}</Text>
    </View>
  );
}
