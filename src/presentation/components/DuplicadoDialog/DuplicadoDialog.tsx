import { Ionicons } from '@expo/vector-icons';
import { Modal, Text, View } from 'react-native';

import {
  formatearComprobante,
  formatearFechaHora,
  formatearFechaIso,
  formatearImporte,
} from '@core/utils/formatters';
import { Factura } from '@domain/entities/Factura';
import { ResumenFactura } from '@domain/entities/ResumenFactura';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { colors } from '@presentation/theme';

import { styles } from './DuplicadoDialog.styles';
import { TEXTOS_DUPLICADO } from './DuplicadoDialog.textos';

type DuplicadoDialogProps = {
  visible: boolean;
  nueva: Factura | null;
  existente: ResumenFactura | null;
  onVerGuardada: () => void;
  onGuardarIgual: () => void;
  onVolver: () => void;
};

type Fila = { etiqueta: string; nueva: string; guardada: string };

/** Avisa que el comprobante ya está guardado y muestra qué cambia entre las dos para que el usuario decida. */
export function DuplicadoDialog({ visible, nueva, existente, onVerGuardada, onGuardarIgual, onVolver }: DuplicadoDialogProps) {
  const filas: Fila[] =
    nueva && existente
      ? [
          {
            etiqueta: TEXTOS_DUPLICADO.filaComprobante,
            nueva: formatearComprobante(nueva.letra || '?', nueva.puntoVenta, nueva.numero),
            guardada: formatearComprobante(existente.letra || '?', existente.puntoVenta, existente.numero),
          },
          {
            etiqueta: TEXTOS_DUPLICADO.filaFecha,
            nueva: formatearFechaIso(nueva.fecha),
            guardada: formatearFechaIso(existente.fecha),
          },
          {
            etiqueta: TEXTOS_DUPLICADO.filaTotal,
            nueva: formatearImporte(nueva.importeTotal),
            guardada: formatearImporte(existente.importe),
          },
          {
            etiqueta: TEXTOS_DUPLICADO.filaEstado,
            nueva: TEXTOS_DUPLICADO.enRevision,
            guardada: formatearFechaHora(existente.creadaEn),
          },
        ]
      : [];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onVolver} statusBarTranslucent>
      <View style={styles.scrim}>
        <View style={styles.card} accessibilityViewIsModal>
          <View style={styles.iconTile}>
            <Ionicons name="copy-outline" size={28} color={colors.brandOrange} />
          </View>

          <Text style={styles.title}>{TEXTOS_DUPLICADO.titulo}</Text>
          <Text style={styles.text}>{TEXTOS_DUPLICADO.mensaje}</Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.label} />
              <Text style={styles.columnTitle}>{TEXTOS_DUPLICADO.columnaNueva}</Text>
              <Text style={styles.columnTitle}>{TEXTOS_DUPLICADO.columnaGuardada}</Text>
            </View>
            {filas.map((fila) => {
              const distinto = fila.nueva !== fila.guardada && fila.etiqueta !== TEXTOS_DUPLICADO.filaEstado;
              return (
                <View key={fila.etiqueta} style={styles.tableRow}>
                  <Text style={styles.label}>{fila.etiqueta}</Text>
                  <Text style={[styles.value, distinto && styles.valueDifferent]}>{fila.nueva}</Text>
                  <Text style={styles.value}>{fila.guardada}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.actions}>
            <PrimaryButton label={TEXTOS_DUPLICADO.verGuardada} onPress={onVerGuardada} />
            <SecondaryButton label={TEXTOS_DUPLICADO.guardarIgual} onPress={onGuardarIgual} />
            <SecondaryButton label={TEXTOS_DUPLICADO.volver} onPress={onVolver} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
