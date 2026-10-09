import { Text, View } from 'react-native';

import { Tema } from '@core/utils/preferenciaTema';
import { Chip } from '@presentation/components/Chip';

import { SettingsSection } from '../SettingsSection';
import { styles } from './AparienciaSection.styles';

type AparienciaSectionProps = {
  tema: Tema;
  onElegir: (tema: Tema) => void;
};

export function AparienciaSection({ tema, onElegir }: AparienciaSectionProps) {
  return (
    <SettingsSection title="APARIENCIA">
      <View style={styles.chips}>
        <Chip label="Claro" selected={tema === 'claro'} onPress={() => onElegir('claro')} />
        <Chip label="Oscuro" selected={tema === 'oscuro'} onPress={() => onElegir('oscuro')} />
      </View>
      <Text style={styles.nota}>La app se reinicia para aplicar el cambio.</Text>
    </SettingsSection>
  );
}
