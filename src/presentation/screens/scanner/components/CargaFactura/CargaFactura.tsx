import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { colors } from '@presentation/theme';

import { styles } from './CargaFactura.styles';
import { DETALLE_CARGA, ETIQUETA_CANCELAR, mensajesDeCarga, TITULO_CARGA } from './CargaFactura.textos';
import { useGiro, useMensajeRotativo } from './useAnimacionCarga';

type CargaFacturaProps = {
  cantidadPaginas: number;
  /** Si el QR de ARCA ya se leyó al escanear, el primer mensaje lo cuenta. */
  qrDetectado: boolean;
  onCancelar: () => void;
};

/**
 * Pantalla que se muestra mientras se leen las páginas escaneadas: un anillo girando y un mensaje
 * que va contando qué se está buscando, para que se note que la app trabaja y no que sigue escaneando.
 */
export function CargaFactura({ cantidadPaginas, qrDetectado, onCancelar }: CargaFacturaProps) {
  const mensajes = useMemo(() => mensajesDeCarga(cantidadPaginas, qrDetectado), [cantidadPaginas, qrDetectado]);
  const { mensaje, indice, estiloFundido } = useMensajeRotativo(mensajes);
  const estiloGiro = useGiro();

  return (
    <View style={styles.container}>
      <View style={styles.contenido}>
        <View style={styles.anillo} importantForAccessibility="no-hide-descendants">
          <View style={styles.anilloFondo} />
          <Animated.View style={[styles.anilloArco, estiloGiro]} />
          <View style={styles.anilloIcono}>
            <Ionicons name="document-text-outline" size={52} color={colors.onPrimary} />
          </View>
        </View>

        <View style={styles.textos}>
          <Text style={styles.titulo} accessibilityRole="header">
            {TITULO_CARGA}
          </Text>
          <Animated.Text style={[styles.mensaje, estiloFundido]} accessibilityLiveRegion="polite">
            {mensaje}
          </Animated.Text>
          <View style={styles.puntos} importantForAccessibility="no-hide-descendants">
            {mensajes.map((texto, posicion) => (
              <View key={texto} style={[styles.punto, posicion === indice ? styles.puntoActivo : null]} />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.pie}>
        <Text style={styles.detalle}>{DETALLE_CARGA}</Text>
        <Pressable
          onPress={onCancelar}
          style={({ pressed }) => [styles.botonCancelar, pressed && styles.botonCancelarPresionado]}
          accessibilityRole="button"
          accessibilityLabel={ETIQUETA_CANCELAR}
        >
          <Text style={styles.etiquetaCancelar}>{ETIQUETA_CANCELAR}</Text>
        </Pressable>
      </View>
    </View>
  );
}
