import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { formatearImporte } from '@core/utils/formatters';
import { ItemFactura } from '@domain/entities/Factura';
import { colors } from '@presentation/theme';

import { styles } from './ItemsFactura.styles';

type ItemsFacturaProps = {
  items: ItemFactura[];
  onEditar: (indice: number) => void;
  onAgregar: () => void;
};

/** Detalle de la factura: cada ítem se puede corregir o borrar, y se pueden agregar los que la IA no vio. */
export function ItemsFactura({ items, onEditar, onAgregar }: ItemsFacturaProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Ítems (${items.length})`}</Text>

      {items.length === 0 ? <Text style={styles.empty}>No hay ítems cargados.</Text> : null}

      {items.map((item, indice) => (
        <Pressable
          key={`${indice}-${item.descripcion}`}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          onPress={() => onEditar(indice)}
          accessibilityRole="button"
          accessibilityLabel={`Editar ítem ${item.descripcion || indice + 1}`}
        >
          <View style={styles.texts}>
            <Text style={styles.description}>{item.descripcion || 'Sin descripción'}</Text>
            <Text style={styles.detail}>
              {`${item.cantidad} × ${formatearImporte(item.precioUnitario)}`}
              {item.alicuotaIva === null ? '' : ` · IVA ${item.alicuotaIva}%`}
            </Text>
          </View>
          <Text style={styles.subtotal}>{formatearImporte(item.subtotal)}</Text>
          <Ionicons name="create-outline" size={18} color={colors.primary} />
        </Pressable>
      ))}

      <Pressable
        style={({ pressed }) => [styles.add, pressed && styles.rowPressed]}
        onPress={onAgregar}
        accessibilityRole="button"
        accessibilityLabel="Agregar ítem"
      >
        <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
        <Text style={styles.addLabel}>Agregar ítem</Text>
      </Pressable>
    </View>
  );
}
