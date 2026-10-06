import { useState } from 'react';
import { Pressable, Text, TextInputProps } from 'react-native';

import { TextField } from '@presentation/components/TextField';

import { styles } from './PasswordField.styles';

type PasswordFieldProps = Omit<TextInputProps, 'style' | 'secureTextEntry'> & {
  label: string;
};

export function PasswordField({ label, ...inputProps }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((current) => !current);
  const toggleLabel = isVisible ? 'Ocultar' : 'Mostrar';

  return (
    <TextField
      label={label}
      secureTextEntry={!isVisible}
      autoCapitalize="none"
      autoCorrect={false}
      rightElement={
        <Pressable
          onPress={toggleVisibility}
          style={styles.toggle}
          accessibilityRole="button"
          accessibilityLabel={`${toggleLabel} contraseña`}
        >
          <Text style={styles.toggleLabel}>{toggleLabel}</Text>
        </Pressable>
      }
      {...inputProps}
    />
  );
}
