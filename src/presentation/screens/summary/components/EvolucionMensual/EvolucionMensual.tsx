import { Text, View } from 'react-native';

import { formatearImporte } from '@core/utils/formatters';
import { TotalMensual } from '@domain/entities/TotalMensual';
import { nombreDelMes } from '@domain/rules/periodos';

import { alturaDeBarra, styles } from './EvolucionMensual.styles';

type EvolucionMensualProps = {
  meses: TotalMensual[];
  /** Cambio del último mes respecto del anterior, en %; null si no hay con qué comparar. */
  variacion: number | null;
};

const abreviatura = (anio: number, mes: number) => nombreDelMes(anio, mes).slice(0, 3);

/** Barras con lo gastado en los últimos meses; la última (el mes elegido) va resaltada. */
export function EvolucionMensual({ meses, variacion }: EvolucionMensualProps) {
  const maximo = Math.max(...meses.map((mes) => Math.max(mes.total, 0)), 0);
  const ultimo = meses.length - 1;

  return (
    <View style={styles.container}>
      {variacion !== null ? (
        <Text style={[styles.variacion, variacion > 0 ? styles.variacionSube : styles.variacionBaja]}>
          {variacion === 0 ? 'Igual que el mes anterior' : `${variacion > 0 ? '▲' : '▼'} ${Math.abs(variacion)}% vs. el mes anterior`}
        </Text>
      ) : null}

      <View style={styles.barras}>
        {meses.map((mes, indice) => (
          <View key={`${mes.anio}-${mes.mes}`} style={styles.columna}>
            <Text style={styles.monto} numberOfLines={1} adjustsFontSizeToFit>
              {mes.total === 0 ? '' : formatearImporte(mes.total)}
            </Text>
            <View style={styles.pista}>
              <View style={[styles.barra, indice === ultimo ? styles.barraActual : null, alturaDeBarra(mes.total, maximo)]} />
            </View>
            <Text style={[styles.mes, indice === ultimo ? styles.mesActual : null]}>{abreviatura(mes.anio, mes.mes)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
