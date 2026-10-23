import { useRef, useState } from 'react';
import { Pressable, Text, TextInputProps, View } from 'react-native';

import { normalizarTexto } from '@domain/rules/texto';
import { TextField } from '@presentation/components/TextField';

import { styles } from './AutocompleteField.styles';

const MAXIMO_OPCIONES_VISIBLES = 6;
/** Espera antes de cerrar la lista al salir del campo: deja que el toque sobre una opción llegue a registrarse. */
const DEMORA_CIERRE_MS = 150;

type AutocompleteFieldProps = Omit<TextInputProps, 'style' | 'value' | 'onChangeText'> & {
  label: string;
  value: string;
  options: readonly string[];
  onChangeText: (texto: string) => void;
  onSelect: (opcion: string) => void;
  errorMessage?: string;
};

/** Campo de texto con lista desplegable: al escribir filtra las opciones, al tocar una la elige. */
export function AutocompleteField({
  label,
  value,
  options,
  onChangeText,
  onSelect,
  errorMessage,
  ...inputProps
}: AutocompleteFieldProps) {
  const [estaAbierto, setEstaAbierto] = useState(false);
  const temporizadorCierre = useRef<ReturnType<typeof setTimeout> | null>(null);

  const textoBuscado = normalizarTexto(value);
  const esOpcionElegida = options.some((opcion) => normalizarTexto(opcion) === textoBuscado);
  // Con el campo vacío o con una opción ya elegida se muestran todas; si no, solo las que coinciden.
  const opcionesVisibles = (
    textoBuscado === '' || esOpcionElegida
      ? [...options]
      : options.filter((opcion) => normalizarTexto(opcion).includes(textoBuscado))
  ).slice(0, MAXIMO_OPCIONES_VISIBLES);

  const cancelarCierre = () => {
    if (temporizadorCierre.current) clearTimeout(temporizadorCierre.current);
  };

  const abrir = () => {
    cancelarCierre();
    setEstaAbierto(true);
  };

  const cerrarConDemora = () => {
    cancelarCierre();
    temporizadorCierre.current = setTimeout(() => setEstaAbierto(false), DEMORA_CIERRE_MS);
  };

  const elegir = (opcion: string) => {
    cancelarCierre();
    onSelect(opcion);
    setEstaAbierto(false);
  };

  const cambiarTexto = (texto: string) => {
    onChangeText(texto);
    setEstaAbierto(true);
  };

  return (
    <View style={styles.container}>
      <TextField
        label={label}
        value={value}
        onChangeText={cambiarTexto}
        onFocus={abrir}
        onBlur={cerrarConDemora}
        errorMessage={errorMessage}
        rightElement={
          <Pressable
            onPress={() => (estaAbierto ? setEstaAbierto(false) : abrir())}
            style={styles.toggle}
            accessibilityRole="button"
            accessibilityLabel={estaAbierto ? `Cerrar lista de ${label}` : `Abrir lista de ${label}`}
          >
            <Text style={styles.toggleIcon}>{estaAbierto ? '▴' : '▾'}</Text>
          </Pressable>
        }
        {...inputProps}
      />

      {estaAbierto && opcionesVisibles.length > 0 ? (
        <View style={styles.list}>
          {opcionesVisibles.map((opcion, indice) => (
            <View key={opcion}>
              {indice > 0 ? <View style={styles.separator} /> : null}
              <Pressable
                onPress={() => elegir(opcion)}
                style={({ pressed }) => [
                  styles.option,
                  pressed || normalizarTexto(opcion) === textoBuscado ? styles.optionPressed : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel={opcion}
              >
                <Text style={styles.optionText}>{opcion}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
