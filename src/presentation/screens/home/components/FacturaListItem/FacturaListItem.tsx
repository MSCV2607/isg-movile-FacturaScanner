import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import {
  formatearComprobante,
  formatearCuit,
  formatearFechaIso,
  formatearImporte,
} from '@core/utils/formatters';
import { ResumenFactura } from '@domain/entities/ResumenFactura';
import { colors } from '@presentation/theme';

import { styles } from './FacturaListItem.styles';

type FacturaListItemProps = {
  factura: ResumenFactura;
  onPress: () => void;
};

export function FacturaListItem({ factura, onPress }: FacturaListItemProps) {
  const comprobante = formatearComprobante(factura.letra || '?', factura.puntoVenta, factura.numero);
  const detalle = `${formatearCuit(factura.cuitEmisor)} · ${formatearFechaIso(factura.fecha)}`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de la factura ${comprobante}`}
    >
      <View style={styles.iconTile}>
        <Ionicons name="document-text-outline" size={22} color={colors.primary} />
      </View>

      <View style={styles.details}>
        <Text style={styles.comprobante}>{comprobante}</Text>
        <Text style={styles.razonSocial} numberOfLines={1}>
          {factura.razonSocial}
        </Text>
        <Text style={styles.meta}>{detalle}</Text>
      </View>

      <View style={styles.summary}>
        <Text style={styles.importe}>{formatearImporte(factura.importe)}</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}
