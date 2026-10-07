import { Text, View } from 'react-native';

import { formatearImporte } from '@core/utils/formatters';
import { Factura } from '@domain/entities/Factura';
import { DetalleFila } from '@presentation/components/DetalleFila';

import { DetailCard } from '../DetailCard';
import { styles } from './ItemsDetalle.styles';

type ItemsDetalleProps = {
  factura: Factura;
};

/** Ítems de la factura, con el neto y el IVA al pie. */
export function ItemsDetalle({ factura }: ItemsDetalleProps) {
  return (
    <DetailCard title="Ítems" aside={`(${factura.items.length})`}>
      {factura.items.length === 0 ? <Text style={styles.empty}>La factura no tiene ítems cargados.</Text> : null}

      {factura.items.map((item, indice) => {
        const iva = item.alicuotaIva === null ? '' : ` · IVA ${item.alicuotaIva}%`;
        return (
          <View key={`${indice}-${item.descripcion}`} style={styles.item}>
            <View style={styles.itemTexts}>
              <Text style={styles.descripcion}>{item.descripcion}</Text>
              <Text style={styles.detalle}>{`${item.cantidad} × ${formatearImporte(item.precioUnitario)}${iva}`}</Text>
            </View>
            <Text style={styles.subtotal}>{formatearImporte(item.subtotal)}</Text>
          </View>
        );
      })}

      <View style={styles.divider} />
      <DetalleFila etiqueta="Neto" valor={formatearImporte(factura.importeNeto)} />
      <DetalleFila etiqueta="IVA" valor={formatearImporte(factura.importeIva)} />
      <DetalleFila etiqueta="Total" valor={formatearImporte(factura.importeTotal)} />
    </DetailCard>
  );
}

