import { Redirect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { ResultLayout } from '@presentation/components/ResultLayout';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { useGuardarFactura } from '@presentation/hooks/useGuardarFactura';
import { useFacturaEnCurso } from '@presentation/state/FacturaEnCursoContext';
import { colors } from '@presentation/theme';

import { DetalleTecnico } from './components/DetalleTecnico';
import { styles } from './FailureScreen.styles';

export function FailureScreen() {
  const router = useRouter();
  const { factura, errorAlGuardar } = useFacturaEnCurso();
  const { guardando, guardar } = useGuardarFactura();

  if (!factura || !errorAlGuardar) return <Redirect href="/home" />;

  return (
    <>
      <StatusBar style="light" />
      <ResultLayout
        iconName="alert-circle"
        iconColor={colors.danger}
        title="No se pudo guardar"
        message="Revisá que el celular tenga espacio libre e intentá de nuevo. Los datos de la factura siguen cargados."
      >
        <DetalleTecnico mensaje={errorAlGuardar} />
        <View style={styles.actions}>
          <PrimaryButton label="Reintentar" loading={guardando} onPress={() => guardar(factura)} />
          <SecondaryButton label="Volver a revisar" onPress={() => router.replace('/revision')} />
        </View>
      </ResultLayout>
    </>
  );
}
