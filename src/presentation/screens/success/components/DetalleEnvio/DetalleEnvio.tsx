import { View } from 'react-native';

import { formatearComprobante, formatearCuit, formatearFechaHora, formatearImporte } from '@core/utils/formatters';
import { FacturaGuardada } from '@domain/entities/FacturaGuardada';
import { DetalleFila } from '@presentation/components/DetalleFila';

import { styles } from './DetalleEnvio.styles';

type DetalleEnvioProps = {
  guardada: FacturaGuardada;
};

/** Resumen de la factura recién guardada. */
export function DetalleEnvio({ guardada }: DetalleEnvioProps) {
  const { factura } = guardada;

  return (
    <View style={styles.card}>
      <DetalleFila
        etiqueta="Comprobante"
        valor={formatearComprobante(factura.letra || '?', factura.puntoVenta, factura.numero)}
      />
      <DetalleFila etiqueta="Emisor" valor={factura.emisor.razonSocial} />
      <DetalleFila etiqueta="CUIT" valor={formatearCuit(factura.emisor.cuit)} />
      <DetalleFila etiqueta="Total" valor={formatearImporte(factura.importeTotal)} />
      <DetalleFila etiqueta="Guardada" valor={formatearFechaHora(guardada.creadaEn)} />
    </View>
  );
}
