import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { formatearImporte } from '@core/utils/formatters';
import { ItemFactura } from '@domain/entities/Factura';
import { Chip } from '@presentation/components/Chip';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { TextField } from '@presentation/components/TextField';
import {
  ALICUOTAS_IVA,
  ErroresItem,
  FORMULARIO_ITEM_VACIO,
  FormularioItem,
  formularioAItem,
  itemAFormulario,
  montosDelItem,
  validarItem,
} from '@presentation/mappers/itemFormulario';
import { colors } from '@presentation/theme';

import { styles } from './ItemEditorSheet.styles';
import { TEXTOS_ITEM } from './ItemEditorSheet.textos';

type ItemEditorSheetProps = {
  visible: boolean;
  /** El ítem que se edita; null para cargar uno nuevo. */
  item: ItemFactura | null;
  onGuardar: (item: ItemFactura) => void;
  /** Solo se ofrece al editar un ítem existente. */
  onEliminar: () => void;
  onCerrar: () => void;
};

/** Hoja inferior para agregar, corregir o borrar un ítem de la factura. */
export function ItemEditorSheet({ visible, item, onGuardar, onEliminar, onCerrar }: ItemEditorSheetProps) {
  const [formulario, setFormulario] = useState<FormularioItem>(FORMULARIO_ITEM_VACIO);
  const [errores, setErrores] = useState<ErroresItem>({});

  // Cada vez que se abre, parte del ítem elegido (o de uno vacío).
  useEffect(() => {
    if (!visible) return;
    setFormulario(item ? itemAFormulario(item) : FORMULARIO_ITEM_VACIO);
    setErrores({});
  }, [visible, item]);

  const cambiar = (campo: 'descripcion' | 'cantidad' | 'precioUnitario', texto: string) => {
    setFormulario((actual) => ({ ...actual, [campo]: texto }));
    setErrores((actual) => ({ ...actual, [campo]: undefined }));
  };

  const alGuardar = () => {
    const erroresDelItem = validarItem(formulario);
    setErrores(erroresDelItem);
    if (Object.keys(erroresDelItem).length === 0) onGuardar(formularioAItem(formulario));
  };

  const { neto, iva } = montosDelItem(formulario);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCerrar} statusBarTranslucent>
      <KeyboardAvoidingView style={styles.scrim} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onCerrar} accessibilityLabel={TEXTOS_ITEM.cerrar} />

        <View style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.handle} />

          <View style={styles.titleRow}>
            <Text style={styles.title}>{item ? TEXTOS_ITEM.tituloEdicion : TEXTOS_ITEM.tituloNuevo}</Text>
            <Pressable onPress={onCerrar} accessibilityRole="button" accessibilityLabel={TEXTOS_ITEM.cerrar} hitSlop={8}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
            <TextField
              label="Descripción"
              value={formulario.descripcion}
              onChangeText={(texto) => cambiar('descripcion', texto)}
              errorMessage={errores.descripcion}
              autoCapitalize="sentences"
            />

            <View style={styles.row}>
              <View style={styles.cell}>
                <TextField
                  label="Cantidad"
                  value={formulario.cantidad}
                  onChangeText={(texto) => cambiar('cantidad', texto)}
                  errorMessage={errores.cantidad}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.cellWide}>
                <TextField
                  label="Precio unitario (neto)"
                  value={formulario.precioUnitario}
                  onChangeText={(texto) => cambiar('precioUnitario', texto)}
                  errorMessage={errores.precioUnitario}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.alicuotas}>
              <Text style={styles.sectionLabel}>{TEXTOS_ITEM.alicuota}</Text>
              <View style={styles.chips}>
                {ALICUOTAS_IVA.map((alicuota) => (
                  <Chip
                    key={alicuota}
                    label={`${String(alicuota).replace('.', ',')}%`}
                    selected={formulario.alicuotaIva === alicuota}
                    onPress={() => setFormulario((actual) => ({ ...actual, alicuotaIva: alicuota }))}
                  />
                ))}
              </View>
            </View>

            <View style={styles.montos}>
              <View style={styles.montoFila}>
                <Text style={styles.montoEtiqueta}>{TEXTOS_ITEM.neto}</Text>
                <Text style={styles.montoValor}>{formatearImporte(neto)}</Text>
              </View>
              <View style={styles.montoFila}>
                <Text style={styles.montoEtiqueta}>{TEXTOS_ITEM.iva}</Text>
                <Text style={styles.montoValor}>{formatearImporte(iva)}</Text>
              </View>
            </View>
            <Text style={styles.nota}>{TEXTOS_ITEM.nota}</Text>

            <View style={styles.actions}>
              <PrimaryButton label={TEXTOS_ITEM.guardar} onPress={alGuardar} />
              {item ? <SecondaryButton label={TEXTOS_ITEM.eliminar} variant="danger" onPress={onEliminar} /> : null}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
