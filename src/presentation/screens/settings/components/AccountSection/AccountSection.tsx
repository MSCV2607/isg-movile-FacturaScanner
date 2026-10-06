import { Text, View } from 'react-native';

import { SecondaryButton } from '@presentation/components/SecondaryButton';

import { SettingsSection } from '../SettingsSection';
import { styles } from './AccountSection.styles';

type AccountSectionProps = {
  userName: string;
  onLogoutPress: () => void;
};

export function AccountSection({ userName, onLogoutPress }: AccountSectionProps) {
  return (
    <SettingsSection title="CUENTA">
      <View style={styles.user}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>{userName.charAt(0).toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.detail}>Sesión iniciada</Text>
        </View>
      </View>
      <SecondaryButton label="Cerrar sesión" variant="danger" onPress={onLogoutPress} />
    </SettingsSection>
  );
}
