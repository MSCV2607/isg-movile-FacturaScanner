import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { PurpleHeader } from '@presentation/components/PurpleHeader';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { useRespaldo } from '@presentation/hooks/useRespaldo';

import { styles } from './BackupScreen.styles';

/** Copia de seguridad de las facturas y sus fotos en una carpeta, para cambiar de celular o recuperarlas. */
export function BackupScreen() {
  const router = useRouter();
  const respaldo = useRespaldo();

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.headerArea} edges={['top']}>
        <PurpleHeader title="Respaldo" subtitle="Guardá o recuperá tus facturas" onBackPress={() => router.back()} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Crear respaldo</Text>
          <Text style={styles.texto}>
            Guarda todas tus facturas, sus fotos y tus categorías en una carpeta nueva dentro de la que elijas. Copiala a la
            nube o a tu computadora para tenerla a salvo.
          </Text>
          <PrimaryButton label="Crear respaldo" onPress={respaldo.crear} loading={respaldo.enCurso === 'crear'} />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Restaurar respaldo</Text>
          <Text style={styles.texto}>
            Elegí la carpeta "Respaldo_Facturas_…". Se suman las facturas que falten; las que ya tenés no se tocan ni se
            repiten.
          </Text>
          <SecondaryButton
            label={respaldo.enCurso === 'restaurar' ? 'Restaurando…' : 'Restaurar desde una carpeta'}
            onPress={respaldo.restaurar}
          />
        </View>

        {respaldo.resultado ? (
          <Text style={[styles.resultado, respaldo.resultado.tipo === 'error' ? styles.resultadoError : styles.resultadoOk]}>
            {respaldo.resultado.mensaje}
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
