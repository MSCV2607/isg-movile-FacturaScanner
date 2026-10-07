import { Text, View } from 'react-native';

import { formatearCuit, formatearImporte } from '@core/utils/formatters';
import { Factura } from '@domain/entities/Factura';

import { DetailCard } from '../DetailCard';
import { styles } from './EmisorResumen.styles';

type EmisorResumenProps = {
  factura: Factura;
};

/** Quién emitió la factura y cuánto es el total. */
export function EmisorResumen({ factura }: EmisorResumenProps) {
  const { emisor } = factura;

  return (
    <DetailCard>
      <Text style={styles.razonSocial}>{emisor.razonSocial}</Text>
      <View style={styles.meta}>
        <Text style={styles.cuit}>{formatearCuit(emisor.cuit)}</Text>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{emisor.condicionFiscal}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.total}>
        <Text style={styles.totalLabel}>Importe total</Text>
        <Text style={styles.totalValue}>{formatearImporte(factura.importeTotal)}</Text>
      </View>
    </DetailCard>
  );
}
