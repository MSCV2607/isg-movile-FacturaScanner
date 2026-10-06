import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@presentation/theme';

import { styles } from './ScannerHeader.styles';

type ScannerHeaderProps = {
  linternaEncendida: boolean;
  onClose: () => void;
  onToggleLinterna: () => void;
};

export function ScannerHeader({ linternaEncendida, onClose, onToggleLinterna }: ScannerHeaderProps) {
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

      <Text style={styles.title}>Escanear QR</Text>

      <Pressable
        onPress={onToggleLinterna}
        style={[styles.button, linternaEncendida ? styles.buttonActive : null]}
        accessibilityRole="button"
        accessibilityLabel={linternaEncendida ? 'Apagar linterna' : 'Encender linterna'}
      >
        <Ionicons
          name={linternaEncendida ? 'flash' : 'flash-outline'}
          size={20}
          color={linternaEncendida ? colors.textPrimary : colors.onPrimary}
        />
      </Pressable>
    </View>
  );
}
