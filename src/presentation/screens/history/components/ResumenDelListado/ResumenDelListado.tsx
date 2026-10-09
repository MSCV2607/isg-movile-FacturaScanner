import { Text, View } from 'react-native';

import { formatearImporte } from '@core/utils/formatters';
import { ResumenPeriodo } from '@domain/entities/ResumenPeriodo';

import { styles } from './ResumenDelListado.styles';

type ResumenDelListadoProps = {
  resumen: ResumenPeriodo;
};

/** Cantidad y total en pesos de lo que se está viendo (cambia al buscar o filtrar). */
export function ResumenDelListado({ resumen }: ResumenDelListadoProps) {
  const otraMoneda =
    resumen.cantidadOtraMoneda > 0
      ? `No incluye ${resumen.cantidadOtraMoneda} ${resumen.cantidadOtraMoneda === 1 ? 'factura' : 'facturas'} en otra moneda.`
      : null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Total en pesos</Text>
        <Text style={styles.total}>{formatearImporte(resumen.total)}</Text>
      </View>
      {otraMoneda ? <Text style={styles.note}>{otraMoneda}</Text> : null}
    </View>
  );
}
