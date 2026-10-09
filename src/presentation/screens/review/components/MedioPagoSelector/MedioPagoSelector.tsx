import { Text, View } from 'react-native';

import { MEDIOS_PAGO } from '@core/config/mediosPago';
import { Chip } from '@presentation/components/Chip';

import { styles } from './MedioPagoSelector.styles';

type MedioPagoSelectorProps = {
  medioPago: string;
  /** Tocar el medio elegido lo desmarca. */
  onCambiar: (medioPago: string) => void;
};

export function MedioPagoSelector({ medioPago, onCambiar }: MedioPagoSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medio de pago</Text>
      <View style={styles.chips}>
        {MEDIOS_PAGO.map((opcion) => (
          <Chip key={opcion} label={opcion} selected={medioPago === opcion} onPress={() => onCambiar(opcion)} />
        ))}
      </View>
    </View>
  );
}
