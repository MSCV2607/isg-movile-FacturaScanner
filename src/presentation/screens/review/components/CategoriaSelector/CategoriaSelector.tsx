import { Text, View } from 'react-native';

import { Chip } from '@presentation/components/Chip';

import { styles } from './CategoriaSelector.styles';

type CategoriaSelectorProps = {
  categoria: string;
  /** Rubros entre los que elegir (los del usuario). */
  opciones: string[];
  /** Texto debajo de los rubros, por ejemplo que se sugirió por el historial. */
  nota?: string;
  /** Tocar el rubro elegido lo desmarca (se manda ''). */
  onCambiar: (categoria: string) => void;
};

export function CategoriaSelector({ categoria, opciones, nota, onCambiar }: CategoriaSelectorProps) {
  // Un rubro que ya no está en la lista pero sigue en la factura se muestra igual, para poder conservarlo o cambiarlo.
  const visibles = categoria !== '' && !opciones.includes(categoria) ? [...opciones, categoria] : opciones;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categoría</Text>
      <View style={styles.chips}>
        {visibles.map((opcion) => (
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
