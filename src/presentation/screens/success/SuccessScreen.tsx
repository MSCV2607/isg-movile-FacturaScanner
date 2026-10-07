import { Redirect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { ResultLayout } from '@presentation/components/ResultLayout';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { useFacturaEnCurso } from '@presentation/state/FacturaEnCursoContext';
import { colors } from '@presentation/theme';

import { DetalleEnvio } from './components/DetalleEnvio';
import { styles } from './SuccessScreen.styles';

export function SuccessScreen() {
  const router = useRouter();
  const { guardada, limpiar } = useFacturaEnCurso();

  if (!guardada) return <Redirect href="/home" />;

  const escanearOtra = () => {
    limpiar();
    router.replace('/escaner');
  };
  const verDetalle = () => {
    const id = String(guardada.id);
    limpiar();
    router.replace({ pathname: '/detalle/[id]', params: { id } });
  };
  const volverAlInicio = () => {
    limpiar();
    router.replace('/home');
  };

  return (
    <>
      <StatusBar style="light" />
      <ResultLayout
        iconName="checkmark"
        iconColor={colors.primary}
        title="¡Factura guardada!"
        message="Quedó guardada en este celular."
      >
        <DetalleEnvio guardada={guardada} />
        <View style={styles.actions}>
          <PrimaryButton label="Escanear otra" onPress={escanearOtra} />
          <SecondaryButton label="Ver detalle" onPress={verDetalle} />
          <SecondaryButton label="Volver al inicio" onPress={volverAlInicio} />
        </View>
      </ResultLayout>
    </>
  );
}
