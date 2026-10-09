import { Text, View } from 'react-native';

import { formatearImporte } from '@core/utils/formatters';
import { TotalPorCategoria } from '@domain/entities/ResumenPeriodo';

import { anchoDeBarra, styles } from './GastoPorCategoria.styles';

type GastoPorCategoriaProps = {
  categorias: TotalPorCategoria[];
};

/** Cuánto se gastó en cada rubro, con una barra proporcional al total del mes. */
export function GastoPorCategoria({ categorias }: GastoPorCategoriaProps) {
  return (
    <View style={styles.container}>
      {categorias.map((categoria) => (
        <View key={categoria.categoria} style={styles.item}>
          <View style={styles.row}>
            <Text style={styles.name}>{categoria.categoria}</Text>
            <Text style={styles.amount}>{formatearImporte(categoria.total)}</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.bar, styles[`bar_${categoria.estadoTope}`], anchoDeBarra(categoria.porcentaje)]} />
          </View>
          <Text style={styles.percent}>{`${categoria.porcentaje}%`}</Text>
          {categoria.tope !== null ? (
            <Text style={[styles.tope, styles[`tope_${categoria.estadoTope}`]]}>
              {`Tope ${formatearImporte(categoria.tope)} · usaste el ${categoria.porcentajeDelTope}%${categoria.estadoTope === 'excedido' ? ' · superado' : ''}`}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}
