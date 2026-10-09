import { Text, View } from 'react-native';

import { formatearCuit, formatearImporte } from '@core/utils/formatters';
import { TotalPorProveedor } from '@domain/entities/ResumenPeriodo';

import { styles } from './TopProveedores.styles';

type TopProveedoresProps = {
  proveedores: TotalPorProveedor[];
};

export function TopProveedores({ proveedores }: TopProveedoresProps) {
  return (
    <View style={styles.container}>
      {proveedores.map((proveedor, indice) => (
        <View key={proveedor.cuit} style={styles.row}>
          <View style={styles.position}>
            <Text style={styles.positionLabel}>{indice + 1}</Text>
          </View>
          <View style={styles.texts}>
            <Text style={styles.name} numberOfLines={1}>
              {proveedor.razonSocial || 'Sin razón social'}
            </Text>
            <Text style={styles.cuit}>{formatearCuit(proveedor.cuit)}</Text>
          </View>
          <Text style={styles.amount}>{formatearImporte(proveedor.total)}</Text>
        </View>
      ))}
    </View>
  );
}
