import { ReactNode } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

import { colors } from '@presentation/theme';

import { styles } from './TextField.styles';

type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  /** Elemento opcional alineado a la derecha, dentro del campo (por ejemplo, un botón). */
  rightElement?: ReactNode;
  /** Mensaje de validación: pinta el campo en rojo y lo muestra debajo. */
  errorMessage?: string;
  /** Aviso que no impide guardar (por ejemplo, que la IA leyó otro valor): se muestra debajo en naranja. */
  noteMessage?: string;
  /** Confirmación (por ejemplo, "CUIT válido"): se muestra debajo en verde cuando no hay error ni aviso. */
  okMessage?: string;
};

export function TextField({ label, rightElement, errorMessage, noteMessage, okMessage, editable, ...inputProps }: TextFieldProps) {
  const inputStyle = [
    styles.input,
    rightElement ? styles.inputWithAction : null,
    editable === false ? styles.inputDisabled : null,
    errorMessage ? styles.inputError : null,
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={inputStyle}
          placeholderTextColor={colors.placeholder}
          accessibilityLabel={label}
          editable={editable}
          {...inputProps}
        />
        {rightElement ? <View style={styles.action}>{rightElement}</View> : null}
      </View>
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      {!errorMessage && noteMessage ? <Text style={styles.noteMessage}>{noteMessage}</Text> : null}
      {!errorMessage && !noteMessage && okMessage ? <Text style={styles.okMessage}>{okMessage}</Text> : null}
    </View>
  );
}
