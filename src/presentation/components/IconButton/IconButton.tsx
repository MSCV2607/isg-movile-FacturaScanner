import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { colors } from '@presentation/theme';

import { styles } from './IconButton.styles';

type IconButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  /** Lo que lee el lector de pantalla: el ícono solo no dice qué hace. */
  accessibilityLabel: string;
  onPress: () => void;
};

/** Botón redondo con un ícono, para usar sobre el encabezado violeta. */
export function IconButton({ icon, accessibilityLabel, onPress }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons name={icon} size={20} color={colors.onPrimary} />
    </Pressable>
  );
}
