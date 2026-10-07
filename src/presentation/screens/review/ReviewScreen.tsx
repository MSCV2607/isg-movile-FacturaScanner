import { Redirect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PurpleHeader } from '@presentation/components/PurpleHeader';
import { useFacturaEnCurso } from '@presentation/state/FacturaEnCursoContext';

import { ReviewForm } from './components/ReviewForm';
import { styles } from './ReviewScreen.styles';

export function ReviewScreen() {
  const router = useRouter();
  const { factura } = useFacturaEnCurso();

  // Sin factura cargada (por ejemplo, tras recargar la app) no hay nada que revisar.
  if (!factura) return <Redirect href="/home" />;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.headerArea} edges={['top']}>
        <PurpleHeader
          title="Revisar datos"
          subtitle="Datos leídos de la foto"
          showDot
          onBackPress={() => router.replace('/escaner')}
        />
      </SafeAreaView>
      <ReviewForm factura={factura} />
    </View>
  );
}
