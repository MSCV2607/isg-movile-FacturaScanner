import { Pressable, Text } from 'react-native';

import { styles } from './Chip.styles';

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

/** Opción de una lista corta (rubro, período, formato). Marcada = elegida. */
export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.chipPressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}
