import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { colors } from '@presentation/theme';

import { styles } from './AccionFila.styles';

type AccionFilaProps = {
  icono: ComponentProps<typeof Ionicons>['name'];
  titulo: string;
  descripcion: string;
  /** Pinta el ícono con el verde de "Excel". */
  destacadaVerde?: boolean;
  /** Etiqueta de estado a la derecha, por ejemplo "Próximamente". */
  etiqueta?: string;
  /** Flecha hacia abajo en vez de hacia la derecha cuando la fila tiene contenido desplegado. */
  desplegada?: boolean;
  cargando?: boolean;
  onPress: () => void;
};

/** Fila de acción con ícono, título y descripción. */
export function AccionFila({
  icono,
  titulo,
  descripcion,
  destacadaVerde = false,
  etiqueta,
  desplegada = false,
  cargando = false,
  onPress,
}: AccionFilaProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={cargando}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ busy: cargando, expanded: desplegada }}
    >
      <View style={[styles.iconTile, destacadaVerde ? styles.iconTileVerde : null]}>
        <Ionicons name={icono} size={22} color={destacadaVerde ? colors.success : colors.primary} />
      </View>

      <View style={styles.texts}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.descripcion}>{descripcion}</Text>
      </View>

      {cargando ? (
        <ActivityIndicator color={colors.primary} />
      ) : etiqueta ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{etiqueta}</Text>
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      )}
      {etiqueta ? (
        <Ionicons name={desplegada ? 'chevron-down' : 'chevron-forward'} size={18} color={colors.textSecondary} />
      ) : null}
    </Pressable>
  );
}
