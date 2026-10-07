import { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { styles } from './DetailCard.styles';

type DetailCardProps = {
  title?: string;
  /** Dato secundario a la derecha del título (por ejemplo, una cantidad). */
  aside?: string;
  children: ReactNode;
};

/** Tarjeta blanca con título opcional, común a todas las secciones del detalle. */
export function DetailCard({ title, aside, children }: DetailCardProps) {
  return (
    <View style={styles.card}>
      {title ? (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {aside ? <Text style={styles.aside}>{aside}</Text> : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}
