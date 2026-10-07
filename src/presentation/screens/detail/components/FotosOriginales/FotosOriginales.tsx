import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';

import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { colors } from '@presentation/theme';

import { DetailCard } from '../DetailCard';
import { styles } from './FotosOriginales.styles';

type FotosOriginalesProps = {
  cantidad: number;
  uris: string[];
  descargando: boolean;
  onVerFotos: () => void;
  onDescargar: () => void;
};

/** Miniaturas de las fotos originales, con los botones para verlas en grande o descargarlas. */
export function FotosOriginales({ cantidad, uris, descargando, onVerFotos, onDescargar }: FotosOriginalesProps) {
  if (cantidad === 0) {
    return (
      <DetailCard title="Foto original">
        <Text style={styles.empty}>Esta factura no tiene fotos guardadas.</Text>
      </DetailCard>
    );
  }

  return (
    <DetailCard title="Foto original" aside={`${cantidad} ${cantidad === 1 ? 'foto' : 'fotos'}`}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbs}>
        {uris.map((uri) => (
          <Image key={uri} source={{ uri }} style={styles.thumb} accessibilityLabel="Miniatura de la foto" />
        ))}
      </ScrollView>

      <View style={styles.buttons}>
        <View style={styles.button}>
          <SecondaryButton label="Ver foto" onPress={onVerFotos} size="compact" />
        </View>
        <View style={styles.button}>
          {descargando ? (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <SecondaryButton label="Descargar" onPress={onDescargar} size="compact" />
          )}
        </View>
      </View>
      <View style={styles.hint}>
        <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.hintText}>Al descargar elegís la carpeta donde se guardan.</Text>
      </View>
    </DetailCard>
  );
}
