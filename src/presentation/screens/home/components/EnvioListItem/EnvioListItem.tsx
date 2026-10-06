import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import {
  formatearComprobante,
  formatearCuit,
  formatearDiaMes,
  formatearImporte,
} from '@core/utils/formatters';
import { Envio, EstadoEnvio } from '@domain/entities/Envio';
import { colors } from '@presentation/theme';

import { styles } from './EnvioListItem.styles';

const ESTADO_UI: Record<EstadoEnvio, { texto: string; badge: object; textoBadge: object }> = {
  enviada: {
    texto: 'Enviada',
    badge: styles.badgeEnviada,
    textoBadge: styles.badgeTextoEnviada,
  },
  error: {
    texto: 'Error',
    badge: styles.badgeError,
    textoBadge: styles.badgeTextoError,
  },
};

type EnvioListItemProps = {
  envio: Envio;
};

export function EnvioListItem({ envio }: EnvioListItemProps) {
  const estadoUi = ESTADO_UI[envio.estado];
  const detalle = `${formatearCuit(envio.cuitEmisor)} · ${formatearDiaMes(envio.fecha)}`;

  return (
    <View style={styles.card}>
      <View style={styles.iconTile}>
        <Ionicons name="document-text-outline" size={22} color={colors.primary} />
      </View>

      <View style={styles.details}>
        <Text style={styles.comprobante}>
          {formatearComprobante(envio.letra, envio.puntoVenta, envio.numero)}
        </Text>
        <Text style={styles.meta}>{detalle}</Text>
      </View>

      <View style={styles.summary}>
        <Text style={styles.importe}>{formatearImporte(envio.importe)}</Text>
        <View style={[styles.badge, estadoUi.badge]}>
          <Text style={[styles.badgeTexto, estadoUi.textoBadge]}>{estadoUi.texto}</Text>
        </View>
      </View>
    </View>
  );
}
