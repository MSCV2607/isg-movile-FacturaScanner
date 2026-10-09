import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, View } from 'react-native';

import { formatearMonto } from '@core/utils/formatters';
import { parsearImporte } from '@core/utils/parsers';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { TextField } from '@presentation/components/TextField';
import { colors } from '@presentation/theme';

import { styles } from './CategoriaEditorSheet.styles';

type CategoriaEditorSheetProps = {
  visible: boolean;
  /** Nombre de la categoría que se edita; null para crear una. */
  categoria: string | null;
  topeActual: number | null;
  /** Devuelve el error a mostrar, o null si se guardó (y la hoja se cierra). */
  onGuardar: (nombre: string, tope: number | null) => Promise<string | null>;
  onEliminar: () => void;
  onCerrar: () => void;
};

/** Hoja inferior para crear o editar un rubro: nombre y tope mensual (opcional). */
export function CategoriaEditorSheet({ visible, categoria, topeActual, onGuardar, onEliminar, onCerrar }: CategoriaEditorSheetProps) {
  const [nombre, setNombre] = useState('');
  const [tope, setTope] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setNombre(categoria ?? '');
    setTope(topeActual !== null ? formatearMonto(topeActual) : '');
    setError(undefined);
  }, [visible, categoria, topeActual]);

  const alGuardar = async () => {
    // Vacío = sin tope; cualquier otra cosa que no sea número la rechaza la validación del dominio.
    const valor = tope.trim() === '' ? null : parsearImporte(tope);
    setGuardando(true);
    const mensaje = await onGuardar(nombre, valor);
    setGuardando(false);
    if (mensaje) setError(mensaje);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCerrar} statusBarTranslucent>
      <KeyboardAvoidingView style={styles.scrim} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onCerrar} accessibilityLabel="Cerrar" />

        <View style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.handle} />
          <View style={styles.titleRow}>
            <Text style={styles.title}>{categoria ? 'Editar categoría' : 'Nueva categoría'}</Text>
            <Pressable onPress={onCerrar} accessibilityRole="button" accessibilityLabel="Cerrar" hitSlop={8}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.form}>
            <TextField
              label="Nombre"
              value={nombre}
              onChangeText={(texto) => {
                setNombre(texto);
                setError(undefined);
              }}
              errorMessage={error}
              autoCapitalize="sentences"
              maxLength={40}
            />
            <TextField
              label="Tope mensual (opcional)"
              value={tope}
              onChangeText={(texto) => {
                setTope(texto);
                setError(undefined);
              }}
              placeholder="Sin tope"
              keyboardType="decimal-pad"
              noteMessage="Si el gasto del mes lo supera, el Resumen te avisa."
            />
            <View style={styles.actions}>
              <PrimaryButton label="Guardar" onPress={alGuardar} loading={guardando} />
              {categoria ? (
                <SecondaryButton label="Eliminar categoría" variant="danger" onPress={onEliminar} />
              ) : null}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
