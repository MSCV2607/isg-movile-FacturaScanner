import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@presentation/theme';

import { styles } from './SelectorMes.styles';

type SelectorMesProps = {
  nombreMes: string;
  puedeAvanzar: boolean;
  onAnterior: () => void;
  onSiguiente: () => void;
};

/** Mes que se está viendo, con flechas para ir al anterior o al siguiente (no pasa del mes actual). */
export function SelectorMes({ nombreMes, puedeAvanzar, onAnterior, onSiguiente }: SelectorMesProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onAnterior}
        style={styles.arrow}
        accessibilityRole="button"
        accessibilityLabel="Mes anterior"
      >
        <Ionicons name="chevron-back" size={22} color={colors.primary} />
      </Pressable>

      <Text style={styles.name}>{nombreMes}</Text>

      <Pressable
        onPress={onSiguiente}
        disabled={!puedeAvanzar}
        style={[styles.arrow, !puedeAvanzar && styles.arrowDisabled]}
        accessibilityRole="button"
        accessibilityLabel="Mes siguiente"
        accessibilityState={{ disabled: !puedeAvanzar }}
      >
        <Ionicons name="chevron-forward" size={22} color={colors.primary} />
      </Pressable>
    </View>
  );
}
