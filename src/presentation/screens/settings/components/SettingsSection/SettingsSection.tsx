import { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { styles } from './SettingsSection.styles';

type SettingsSectionProps = {
  title: string;
  children: ReactNode;
};

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}
