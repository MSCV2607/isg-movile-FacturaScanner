import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@presentation/theme';

import { styles } from './PurpleHeader.styles';

type PurpleHeaderProps = {
  title: string;
  subtitle?: string;
  /** Punto naranja delante del subtítulo (estado "listo"). */
  showDot?: boolean;
  onBackPress: () => void;
};

export function PurpleHeader({ title, subtitle, showDot = false, onBackPress }: PurpleHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBackPress}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Volver"
      >
        <Ionicons name="chevron-back" size={22} color={colors.onPrimary} />
      </Pressable>

      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? (
          <View style={styles.subtitleRow}>
            {showDot ? <View style={styles.dot} /> : null}
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
