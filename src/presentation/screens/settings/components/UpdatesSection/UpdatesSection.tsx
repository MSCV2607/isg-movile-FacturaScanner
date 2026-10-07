import { Text } from 'react-native';

import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { EstadoBusqueda } from '@presentation/hooks/useBuscarActualizaciones';

import { SettingsSection } from '../SettingsSection';
import { styles } from './UpdatesSection.styles';

type UpdatesSectionProps = {
  versionActual: string;
  estado: EstadoBusqueda;
  mensajeError: string;
  onBuscarPress: () => void;
};

const MENSAJES: Record<Exclude<EstadoBusqueda, 'error'>, string> = {
  inicial: 'La app busca sola cuando se abre. También podés buscar ahora.',
  buscando: 'Buscando actualizaciones…',
  'al-dia': 'Ya tenés la última versión.',
  disponible: 'Hay una versión nueva. Elegí si querés actualizar en el cartel.',
};

export function UpdatesSection({ versionActual, estado, mensajeError, onBuscarPress }: UpdatesSectionProps) {
  const esError = estado === 'error';

  return (
    <SettingsSection title="ACTUALIZACIONES">
      <Text style={styles.version}>{`Versión instalada: ${versionActual}`}</Text>
      <Text style={[styles.status, esError ? styles.statusError : null, estado === 'al-dia' ? styles.statusOk : null]}>
        {esError ? mensajeError : MENSAJES[estado]}
      </Text>
      <SecondaryButton
        label={estado === 'buscando' ? 'Buscando…' : 'Buscar actualizaciones'}
        onPress={onBuscarPress}
      />
    </SettingsSection>
  );
}
