import { Text } from 'react-native';

import { PROVEEDOR_IA_ACTUAL } from '@core/config/proveedorIa';
import { PasswordField } from '@presentation/components/PasswordField';
import { ResumenPrecisionIa } from '@domain/entities/RegistroLectura';
import { precisionIaTexto } from '@presentation/mappers/precisionIaTexto';

import { SettingsSection } from '../SettingsSection';
import { styles } from './AiSection.styles';

type AiSectionProps = {
  apiKey: string;
  onApiKeyChange: (texto: string) => void;
  /** Cuánto acierta la lectura hasta ahora; sin datos no se muestra. */
  precision?: ResumenPrecisionIa | null;
};

export function AiSection({ apiKey, onApiKeyChange, precision = null }: AiSectionProps) {
  const lineasPrecision = precisionIaTexto(precision);

  return (
    <SettingsSection title="LECTURA CON IA">
      <PasswordField
        label={`API key de ${PROVEEDOR_IA_ACTUAL.nombre}`}
        value={apiKey}
        onChangeText={onApiKeyChange}
        placeholder={PROVEEDOR_IA_ACTUAL.ejemploClave}
      />
      <Text style={styles.note}>
        Se guarda solo en este celular y se usa para leer las facturas. Es una solución de prueba: más adelante la lectura pasa
        por tu servidor.
      </Text>
      {lineasPrecision.map((linea) => (
        <Text key={linea} style={styles.note}>
          {linea}
        </Text>
      ))}
    </SettingsSection>
  );
}
