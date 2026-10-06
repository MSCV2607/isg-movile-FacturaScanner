import { Pressable, Text, View } from 'react-native';

import { ModoEscaneo } from '@presentation/hooks/modoEscaneo';

import { styles } from './ModoSelector.styles';

type ModoSelectorProps = {
  modo: ModoEscaneo;
  onChange: (modo: ModoEscaneo) => void;
};

const OPCIONES: { modo: ModoEscaneo; etiqueta: string }[] = [
  { modo: 'automatico', etiqueta: 'Automático' },
  { modo: 'manual', etiqueta: 'Manual' },
];

/** Selector entre sacar las fotos solas (automático) o una por una (manual). */
export function ModoSelector({ modo, onChange }: ModoSelectorProps) {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      {OPCIONES.map((opcion) => {
        const activa = opcion.modo === modo;
        return (
          <Pressable
            key={opcion.modo}
            onPress={() => onChange(opcion.modo)}
            style={[styles.option, activa ? styles.optionActive : null]}
            accessibilityRole="tab"
            accessibilityState={{ selected: activa }}
            accessibilityLabel={`Modo ${opcion.etiqueta}`}
          >
            <Text style={[styles.label, activa ? styles.labelActive : null]}>{opcion.etiqueta}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
