import { View } from 'react-native';

import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { TextField } from '@presentation/components/TextField';

import { styles } from './CorreoOtraPersona.styles';

type CorreoOtraPersonaProps = {
  correo: string;
  onCorreoChange: (texto: string) => void;
  onEnviar: () => void;
};

/** Campo para escribir el correo de otra persona y el botón de enviar (por ahora solo visual). */
export function CorreoOtraPersona({ correo, onCorreoChange, onEnviar }: CorreoOtraPersonaProps) {
  return (
    <View style={styles.container}>
      <TextField
        label="Correo de la persona"
        value={correo}
        onChangeText={onCorreoChange}
        placeholder="nombre@empresa.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <PrimaryButton label="Enviar" onPress={onEnviar} />
    </View>
  );
}
