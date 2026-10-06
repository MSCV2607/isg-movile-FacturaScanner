import { Text, View } from 'react-native';

import { ErroresConfiguracion } from '@domain/entities/Configuracion';
import { PasswordField } from '@presentation/components/PasswordField';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { TextField } from '@presentation/components/TextField';
import { EstadoConexion } from '@presentation/hooks/useConfiguracion';

import { SettingsSection } from '../SettingsSection';
import { styles } from './ServerSection.styles';

type ServerSectionProps = {
  endpointUrl: string;
  token: string;
  errores: ErroresConfiguracion;
  conexion: EstadoConexion;
  onEndpointChange: (texto: string) => void;
  onTokenChange: (texto: string) => void;
  onProbarConexion: () => void;
};

function textoDeConexion(conexion: EstadoConexion): string {
  switch (conexion.tipo) {
    case 'probando':
      return 'Probando...';
    case 'correcta':
    case 'fallida':
      return conexion.mensaje;
    default:
      return '';
  }
}

export function ServerSection({
  endpointUrl,
  token,
  errores,
  conexion,
  onEndpointChange,
  onTokenChange,
  onProbarConexion,
}: ServerSectionProps) {
  const texto = textoDeConexion(conexion);

  return (
    <SettingsSection title="SERVIDOR">
      <TextField
        label="URL del endpoint"
        value={endpointUrl}
        onChangeText={onEndpointChange}
        errorMessage={errores.endpointUrl}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="https://api.empresa.com/facturas"
      />
      <PasswordField
        label="Token de acceso"
        value={token}
        onChangeText={onTokenChange}
        placeholder="Token"
      />

      <View style={styles.testRow}>
        <SecondaryButton label="Probar conexión" size="compact" onPress={onProbarConexion} />
        {texto ? (
          <View style={styles.status}>
            {conexion.tipo !== 'probando' ? (
              <View style={[styles.dot, conexion.tipo === 'fallida' ? styles.dotError : styles.dotOk]} />
            ) : null}
            <Text
              style={[styles.statusText, conexion.tipo === 'fallida' ? styles.statusTextError : null]}
            >
              {texto}
            </Text>
          </View>
        ) : null}
      </View>
    </SettingsSection>
  );
}
