import { Ionicons } from '@expo/vector-icons';
import { Modal, Text, View } from 'react-native';

import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { colors } from '@presentation/theme';

import { styles } from './ActualizacionDialog.styles';
import { TextosCartel } from './ActualizacionDialog.textos';

type ActualizacionDialogProps = {
  visible: boolean;
  textos: TextosCartel;
  /** Mientras se descarga la actualización los botones quedan bloqueados. */
  instalando: boolean;
  mensajeError: string;
  onActualizar: () => void;
  onDespues: () => void;
};

/** Cartel que pregunta si se quiere instalar la actualización de la app. */
export function ActualizacionDialog({
  visible,
  textos,
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

          <Text style={styles.title}>{textos.titulo}</Text>
          <Text style={styles.text}>{textos.mensaje}</Text>
          <Text style={styles.hint}>{textos.pista}</Text>

          {mensajeError !== '' ? <Text style={styles.error}>{mensajeError}</Text> : null}

          <View style={styles.actions}>
            <PrimaryButton label={textos.accion} loading={instalando} onPress={onActualizar} />
            {instalando ? null : <SecondaryButton label="Ahora no" onPress={onDespues} />}
          </View>
        </View>
      </View>
    </Modal>
  );
}
