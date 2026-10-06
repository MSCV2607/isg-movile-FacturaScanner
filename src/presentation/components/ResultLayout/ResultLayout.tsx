import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './ResultLayout.styles';

type ResultLayoutProps = {
  iconName: ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  title: string;
  message: string;
  /** Contenido de la hoja blanca inferior: detalle y botones. */
  children: ReactNode;
};

/** Estructura común de las pantallas de resultado (envío correcto / envío fallido). */
export function ResultLayout({ iconName, iconColor, title, message, children }: ResultLayoutProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.top}>
        <View style={styles.iconCircle}>
          <Ionicons name={iconName} size={56} color={iconColor} />
          <View style={styles.dot} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      <SafeAreaView style={styles.sheet} edges={['bottom']}>
        <View style={styles.sheetContent}>{children}</View>
      </SafeAreaView>
    </SafeAreaView>
  );
}
