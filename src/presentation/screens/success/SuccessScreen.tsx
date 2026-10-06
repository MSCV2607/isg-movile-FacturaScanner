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
  const { factura, resultado, limpiar } = useFacturaEnCurso();

  if (!factura || !resultado) return <Redirect href="/home" />;

  const escanearOtra = () => {
    limpiar();
    router.replace('/escaner');
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
        title="¡Factura enviada!"
        message="Los datos se guardaron correctamente."
      >
        <DetalleEnvio factura={factura} resultado={resultado} />
        <View style={styles.actions}>
          <PrimaryButton label="Escanear otra" onPress={escanearOtra} />
          <SecondaryButton label="Volver al inicio" onPress={volverAlInicio} />
        </View>
      </ResultLayout>
    </>
  );
}
