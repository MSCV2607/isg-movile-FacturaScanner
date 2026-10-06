import { Text, View } from 'react-native';

import { formatearImporte } from '@core/utils/formatters';
import { ItemFactura } from '@domain/entities/Factura';

import { styles } from './ItemsFactura.styles';

type ItemsFacturaProps = {
  items: ItemFactura[];
};

/** Detalle de la factura, solo lectura. Si la IA se equivocó, se descarta y se vuelve a sacar la foto. */
export function ItemsFactura({ items }: ItemsFacturaProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Ítems (${items.length})`}</Text>

      {items.length === 0 ? <Text style={styles.empty}>No se detectaron ítems.</Text> : null}

      {items.map((item, indice) => (
        <View key={`${indice}-${item.descripcion}`} style={styles.row}>
          <View style={styles.texts}>
            <Text style={styles.description}>{item.descripcion || 'Sin descripción'}</Text>
            <Text style={styles.detail}>
              {`${item.cantidad} × ${formatearImporte(item.precioUnitario)}`}
              {item.alicuotaIva === null ? '' : ` · IVA ${item.alicuotaIva}%`}
            </Text>
          </View>
          <Text style={styles.subtotal}>{formatearImporte(item.subtotal)}</Text>
        </View>
      ))}
    </View>
  );
}
