import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@presentation/theme';

import { styles } from './ScannerHeader.styles';

type ScannerHeaderProps = {
  onClose: () => void;
  /** Mientras se leen las páginas el título cambia, para que no parezca que sigue escaneando. */
  procesando?: boolean;
};

export function ScannerHeader({ onClose, procesando = false }: ScannerHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onClose}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel={procesando ? 'Cancelar lectura' : 'Cerrar escáner'}
      >
        <Ionicons name="close" size={22} color={colors.onPrimary} />
      </Pressable>

      <Text style={styles.title}>{procesando ? 'Procesando factura' : 'Escanear factura'}</Text>

      {/* Mismo ancho que el botón de cerrar, para que el título quede centrado. */}
      <View style={styles.spacer} />
    </View>
  );
}
