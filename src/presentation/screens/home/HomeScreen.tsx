import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { USUARIO_PROVISORIO } from '@core/config/usuarioProvisorio';
import { useUltimasFacturas } from '@presentation/hooks/useUltimasFacturas';
import { colors } from '@presentation/theme';

import { FacturaListItem } from './components/FacturaListItem';
import { HomeHeader } from './components/HomeHeader';
import { ScanCard } from './components/ScanCard';
import { styles } from './HomeScreen.styles';

export function HomeScreen() {
  const router = useRouter();
  const { facturas, isLoading, hasError } = useUltimasFacturas();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <HomeHeader
          userName={USUARIO_PROVISORIO.nombre}
          onSettingsPress={() => router.push('/configuracion')}
        />
        <ScanCard onPress={() => router.push('/escaner')} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimos escaneos</Text>
            {facturas.length > 0 ? (
              <Pressable
                onPress={() => router.push('/historial')}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Ver todo el historial"
              >
                <Text style={styles.sectionLink}>Ver todo</Text>
              </Pressable>
            ) : null}
          </View>
          {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
          {hasError ? <Text style={styles.message}>No se pudieron cargar las facturas.</Text> : null}
          {!isLoading && !hasError && facturas.length === 0 ? (
            <Text style={styles.message}>Todavía no guardaste ninguna factura. Escaneá la primera.</Text>
          ) : null}
          {facturas.map((factura) => (
            <FacturaListItem
              key={factura.id}
              factura={factura}
              onPress={() => router.push({ pathname: '/detalle/[id]', params: { id: String(factura.id) } })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
