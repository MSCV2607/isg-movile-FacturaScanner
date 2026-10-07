import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@presentation/theme';

import { styles } from './ScannerHeader.styles';

type ScannerHeaderProps = {
  onClose: () => void;
};

export function ScannerHeader({ onClose }: ScannerHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onClose}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Cerrar escáner"
      >
        <Ionicons name="close" size={22} color={colors.onPrimary} />
      </Pressable>

      <Text style={styles.title}>Escanear factura</Text>

      {/* Mismo ancho que el botón de cerrar, para que el título quede centrado. */}
      <View style={styles.spacer} />
    </View>
  );
}
