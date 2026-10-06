import { Redirect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { ResultLayout } from '@presentation/components/ResultLayout';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { useEnviarFactura } from '@presentation/hooks/useEnviarFactura';
import { useFacturaEnCurso } from '@presentation/state/FacturaEnCursoContext';
import { colors } from '@presentation/theme';

import { DetalleTecnico } from './components/DetalleTecnico';
import { styles } from './FailureScreen.styles';

export function FailureScreen() {
  const router = useRouter();
  const { factura, resultado } = useFacturaEnCurso();
  const { enviando, enviar } = useEnviarFactura();

  if (!factura || !resultado) return <Redirect href="/home" />;

  return (
    <>
      <StatusBar style="light" />
      <ResultLayout
        iconName="alert-circle"
        iconColor={colors.danger}
        title="No se pudo enviar"
        message="Revisá tu conexión o intentá de nuevo. Los datos de la factura siguen cargados."
      >
        <DetalleTecnico resultado={resultado} />
        <View style={styles.actions}>
          <PrimaryButton label="Reintentar" loading={enviando} onPress={() => enviar(factura)} />
          <SecondaryButton label="Volver a revisar" onPress={() => router.replace('/revision')} />
        </View>
      </ResultLayout>
    </>
  );
}
