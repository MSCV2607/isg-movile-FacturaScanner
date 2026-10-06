import { Pressable, View } from 'react-native';

import { styles } from './ShutterButton.styles';

type ShutterButtonProps = {
  onPress: () => void;
};

export function ShutterButton({ onPress }: ShutterButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.outer, pressed && styles.outerPressed]}
      accessibilityRole="button"
      accessibilityLabel="Sacar foto de la factura"
    >
      <View style={styles.inner} />
    </Pressable>
  );
}
