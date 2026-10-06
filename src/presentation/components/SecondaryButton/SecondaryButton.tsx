import { Pressable, Text } from 'react-native';

import { styles } from './SecondaryButton.styles';

type SecondaryButtonProps = {
  label: string;
  onPress?: () => void;
  /** 'danger' se usa para acciones destructivas, como cerrar sesión. */
  variant?: 'default' | 'danger';
  /** 'compact' es un botón bajo, para acciones secundarias dentro de un formulario. */
  size?: 'regular' | 'compact';
};

export function SecondaryButton({ label, onPress, variant = 'default', size = 'regular' }: SecondaryButtonProps) {
  const isDanger = variant === 'danger';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        size === 'compact' ? styles.buttonCompact : null,
        isDanger ? styles.buttonDanger : null,
        pressed && styles.buttonPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.label, size === 'compact' ? styles.labelCompact : null, isDanger ? styles.labelDanger : null]}>{label}</Text>
    </Pressable>
  );
}
