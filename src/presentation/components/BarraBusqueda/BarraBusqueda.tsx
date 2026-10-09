import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';

import { colors } from '@presentation/theme';

import { styles } from './BarraBusqueda.styles';

type BarraBusquedaProps = {
  value: string;
  onChangeText: (texto: string) => void;
  placeholder: string;
};

export function BarraBusqueda({ value, onChangeText, placeholder }: BarraBusquedaProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={colors.placeholder} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        accessibilityLabel={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value !== '' ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Borrar búsqueda">
          <Ionicons name="close-circle" size={20} color={colors.placeholder} />
        </Pressable>
      ) : null}
    </View>
  );
}
