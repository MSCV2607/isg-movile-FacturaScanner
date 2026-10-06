import { View } from 'react-native';

import { formatearComprobante, formatearCuit, formatearImporte } from '@core/utils/formatters';
import { Factura } from '@domain/entities/Factura';
import { ResultadoEnvio } from '@domain/entities/ResultadoEnvio';

import { DetalleFila } from '../DetalleFila';
import { styles } from './DetalleEnvio.styles';

type DetalleEnvioProps = {
  factura: Factura;
  resultado: ResultadoEnvio;
};

export function DetalleEnvio({ factura, resultado }: DetalleEnvioProps) {
  const respuesta = `${resultado.codigoHttp ?? ''} ${resultado.textoHttp}`.trim();

  return (
    <View style={styles.card}>
      <DetalleFila
        etiqueta="Comprobante"
        valor={formatearComprobante(factura.letra || '?', factura.puntoVenta, factura.numero)}
      />
      <DetalleFila etiqueta="Emisor" valor={factura.emisor.razonSocial} />
      <DetalleFila etiqueta="CUIT" valor={formatearCuit(factura.emisor.cuit)} />
      <DetalleFila etiqueta="Total" valor={formatearImporte(factura.importeTotal)} />
      <DetalleFila etiqueta="Respuesta" valor={respuesta} />
    </View>
  );
}
