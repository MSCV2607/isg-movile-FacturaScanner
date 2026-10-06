import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@presentation/theme';

import { styles } from './ScanCard.styles';

type ScanCardProps = {
  onPress?: () => void;
};

export function ScanCard({ onPress }: ScanCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel="Escanear factura"
    >
      <View style={styles.decoration} />

      <View style={styles.iconTile}>
        <Ionicons name="scan-outline" size={32} color={colors.textPrimary} />
      </View>

      <View style={styles.footer}>
        <View style={styles.texts}>
          <Text style={styles.title}>Escanear factura</Text>
          <Text style={styles.subtitle}>Sacale una foto y completamos los datos por vos.</Text>
        </View>
        <View style={styles.arrowButton}>
          <Ionicons name="arrow-forward" size={22} color={colors.textPrimary} />
        </View>
      </View>
    </Pressable>
  );
}
