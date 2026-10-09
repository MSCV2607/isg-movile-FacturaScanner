import { Text, View } from 'react-native';

import { CATEGORIAS_FACTURA } from '@core/config/categorias';
import { Chip } from '@presentation/components/Chip';

import { styles } from './CategoriaSelector.styles';

type CategoriaSelectorProps = {
  categoria: string;
  /** Texto debajo de los rubros, por ejemplo que se sugirió por el historial. */
  nota?: string;
  /** Tocar el rubro elegido lo desmarca (se manda ''). */
  onCambiar: (categoria: string) => void;
};

export function CategoriaSelector({ categoria, nota, onCambiar }: CategoriaSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categoría</Text>
      <View style={styles.chips}>
        {CATEGORIAS_FACTURA.map((opcion) => (
          <Chip
            key={opcion}
            label={opcion}
            selected={categoria === opcion}
            onPress={() => onCambiar(categoria === opcion ? '' : opcion)}
          />
        ))}
      </View>
      {nota ? <Text style={styles.nota}>{nota}</Text> : null}
    </View>
  );
}
