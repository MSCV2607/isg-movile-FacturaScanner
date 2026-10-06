import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { USUARIO_PROVISORIO } from '@core/config/usuarioProvisorio';
import { useUltimosEnvios } from '@presentation/hooks/useUltimosEnvios';
import { colors } from '@presentation/theme';

import { EnvioListItem } from './components/EnvioListItem';
import { HomeHeader } from './components/HomeHeader';
import { ScanCard } from './components/ScanCard';
import { styles } from './HomeScreen.styles';

export function HomeScreen() {
  const router = useRouter();
  const { envios, isLoading, hasError } = useUltimosEnvios();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <HomeHeader
          userName={USUARIO_PROVISORIO.nombre}
          onSettingsPress={() => router.push('/configuracion')}
        />
        <ScanCard onPress={() => router.push('/escaner')} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimos envíos</Text>
          {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
          {hasError ? <Text style={styles.message}>No se pudieron cargar los envíos.</Text> : null}
          {envios.map((envio) => (
            <EnvioListItem key={envio.id} envio={envio} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
