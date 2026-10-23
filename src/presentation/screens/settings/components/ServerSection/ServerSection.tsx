import { Text } from 'react-native';

import { PasswordField } from '@presentation/components/PasswordField';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { TextField } from '@presentation/components/TextField';
import { EstadoConexion } from '@presentation/hooks/useConfiguracion';

import { SettingsSection } from '../SettingsSection';
import { styles } from './ServerSection.styles';

type ServerSectionProps = {
  url: string;
  token: string;
  estado: EstadoConexion;
  mensaje: string;
  /** Con `true` la conexión es de mentira: se avisa para que nadie crea que habla con el servidor real. */
  simulado: boolean;
  onUrlChange: (texto: string) => void;
  onTokenChange: (texto: string) => void;
  onProbarPress: () => void;
};

const NOTA_SIMULADA =
  'Conexión simulada: todavía no se habla con el servidor real. Si la URL contiene la palabra "fallo", la prueba responde con error.';
const NOTA_REAL = 'La app va a enviar las facturas confirmadas a esta dirección.';

export function ServerSection({
  url,
  token,
  estado,
  mensaje,
  simulado,
  onUrlChange,
  onTokenChange,
  onProbarPress,
}: ServerSectionProps) {
  const estaProbando = estado === 'probando';
  const hayResultado = estado === 'correcta' || estado === 'fallida';

  return (
    <SettingsSection title="CONEXIÓN A LA API">
      <TextField
        label="URL de la API"
        value={url}
        onChangeText={onUrlChange}
        placeholder="https://api.empresa.com/facturas"
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <PasswordField label="Token de acceso" value={token} onChangeText={onTokenChange} placeholder="Opcional" />
      <SecondaryButton label={estaProbando ? 'Probando…' : 'Probar conexión'} onPress={onProbarPress} />
      {hayResultado ? (
        <Text style={[styles.status, estado === 'correcta' ? styles.statusOk : styles.statusError]}>{mensaje}</Text>
      ) : null}
      <Text style={styles.note}>{simulado ? NOTA_SIMULADA : NOTA_REAL}</Text>
    </SettingsSection>
  );
}
