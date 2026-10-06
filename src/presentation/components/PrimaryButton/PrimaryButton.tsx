import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

import { colors } from '@presentation/theme';

import { styles } from './PrimaryButton.styles';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  /** Muestra un indicador de carga y bloquea el botón. */
  loading?: boolean;
  /** Ícono opcional a la derecha del texto. */
  rightIcon?: ReactNode;
};

export function PrimaryButton({ label, onPress, loading = false, rightIcon }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [styles.button, (pressed || loading) && styles.buttonPressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ busy: loading, disabled: loading }}
    >
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <>
          <Text style={styles.label}>{label}</Text>
          {rightIcon}
        </>
      )}
    </Pressable>
  );
}
