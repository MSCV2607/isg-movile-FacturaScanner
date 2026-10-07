import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Modal, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@presentation/theme';

import { styles } from './VisorFotos.styles';

type VisorFotosProps = {
  visible: boolean;
  uris: string[];
  onClose: () => void;
};

/** Muestra las fotos originales a pantalla completa; se desliza de una a otra. */
export function VisorFotos({ visible, uris, onClose }: VisorFotosProps) {
  const [indice, setIndice] = useState(0);

  const alDeslizar = (evento: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = evento.nativeEvent;
    setIndice(Math.round(contentOffset.x / layoutMeasurement.width));
  };

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.screen}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={alDeslizar}>
          {uris.map((uri) => (
            <View key={uri} style={styles.page}>
              <Image source={{ uri }} style={styles.photo} resizeMode="contain" accessibilityLabel="Foto de la factura" />
            </View>
          ))}
        </ScrollView>

        <SafeAreaView style={styles.overlay} edges={['top', 'bottom']} pointerEvents="box-none">
          <View style={styles.top}>
            <Text style={styles.counter}>{`${Math.min(indice + 1, uris.length)} / ${uris.length}`}</Text>
            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Cerrar"
            >
              <Ionicons name="close" size={24} color={colors.onPrimary} />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
