import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';

import { colors, logos } from '@presentation/theme';

import { styles } from './HomeHeader.styles';

type HomeHeaderProps = {
  userName: string;
  onSettingsPress?: () => void;
};

export function HomeHeader({ userName, onSettingsPress }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.identity}>
        <View style={styles.logoTile}>
          <Image
            source={logos.facturaScannerSymbol}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Logo de ISG-FacturaScanner"
          />
        </View>
        <View>
          <Text style={styles.greeting}>Hola, {userName}</Text>
          <Text style={styles.appName}>
            <Text style={styles.appNameBrand}>ISG</Text>-FacturaScanner
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onSettingsPress}
        style={styles.settingsButton}
        accessibilityRole="button"
        accessibilityLabel="Configuración"
      >
        <Ionicons name="options-outline" size={24} color={colors.primaryDark} />
      </Pressable>
    </View>
  );
}
