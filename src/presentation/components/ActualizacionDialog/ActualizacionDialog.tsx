import { Ionicons } from '@expo/vector-icons';
import { Modal, Text, View } from 'react-native';

import { formatearFechaHora } from '@core/utils/formatters';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { colors } from '@presentation/theme';

import { styles } from './ActualizacionDialog.styles';

type ActualizacionDialogProps = {
  visible: boolean;
  publicadaEn: Date | null;
  /** Mientras se descarga la actualización los botones quedan bloqueados. */
  instalando: boolean;
  mensajeError: string;
  onActualizar: () => void;
  onDespues: () => void;
};

/** Cartel que pregunta si se quiere instalar la actualización de la app. */
export function ActualizacionDialog({
  visible,
  publicadaEn,
  instalando,
  mensajeError,
  onActualizar,
  onDespues,
}: ActualizacionDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={instalando ? undefined : onDespues} statusBarTranslucent>
      <View style={styles.scrim}>
        <View style={styles.card} accessibilityViewIsModal>
          <View style={styles.iconTile}>
            <Ionicons name="cloud-download-outline" size={28} color={colors.primary} />
          </View>

          <Text style={styles.title}>Hay una actualización</Text>
          <Text style={styles.text}>
            {publicadaEn
              ? `Se publicó una versión nueva de la app el ${formatearFechaHora(publicadaEn)}. ¿Querés actualizar ahora?`
              : 'Se publicó una versión nueva de la app. ¿Querés actualizar ahora?'}
          </Text>
          <Text style={styles.hint}>Se descarga y la app se reinicia sola. No perdés tus facturas guardadas.</Text>

          {mensajeError !== '' ? <Text style={styles.error}>{mensajeError}</Text> : null}

          <View style={styles.actions}>
            <PrimaryButton label="Actualizar ahora" loading={instalando} onPress={onActualizar} />
            {instalando ? null : <SecondaryButton label="Ahora no" onPress={onDespues} />}
          </View>
        </View>
      </View>
    </Modal>
  );
}
