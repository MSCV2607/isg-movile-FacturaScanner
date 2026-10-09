import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, FlatList, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarraBusqueda } from '@presentation/components/BarraBusqueda';
import { Chip } from '@presentation/components/Chip';
import { IconButton } from '@presentation/components/IconButton';
import { PurpleHeader } from '@presentation/components/PurpleHeader';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { useHistorial } from '@presentation/hooks/useHistorial';
import { OPCIONES_PERIODO } from '@presentation/mappers/periodoOpciones';
import { colors } from '@presentation/theme';

import { FacturaListItem } from '../home/components/FacturaListItem';
import { ResumenDelListado } from './components/ResumenDelListado';
import { styles } from './HistoryScreen.styles';
import { TEXTOS_HISTORIAL } from './HistoryScreen.textos';

export function HistoryScreen() {
  const router = useRouter();
  const historial = useHistorial();
  const { visibles, resumen, isLoading, hasError, hayFiltros } = historial;

  const encabezado = (
    <View style={styles.filters}>
      <BarraBusqueda value={historial.texto} onChangeText={historial.setTexto} placeholder={TEXTOS_HISTORIAL.buscar} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {OPCIONES_PERIODO.map((opcion) => (
          <Chip
            key={opcion.valor}
            label={opcion.etiqueta}
            selected={historial.periodo === opcion.valor}
            onPress={() => historial.setPeriodo(opcion.valor)}
          />
        ))}
      </ScrollView>

      {visibles.length > 0 ? <ResumenDelListado resumen={resumen} /> : null}
    </View>
  );

  const vacio = isLoading ? (
    <ActivityIndicator color={colors.primary} />
  ) : (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>
        {hasError
          ? TEXTOS_HISTORIAL.errorCarga
          : hayFiltros
            ? TEXTOS_HISTORIAL.vacioConFiltros
            : TEXTOS_HISTORIAL.vacioSinFacturas}
      </Text>
      {hayFiltros ? <SecondaryButton label={TEXTOS_HISTORIAL.limpiarFiltros} onPress={historial.limpiarFiltros} /> : null}
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.headerArea} edges={['top']}>
        <PurpleHeader
          title={TEXTOS_HISTORIAL.titulo}
          subtitle={TEXTOS_HISTORIAL.subtitulo(visibles.length)}
          onBackPress={() => router.back()}
          acciones={
            <>
              <IconButton icon="stats-chart-outline" accessibilityLabel={TEXTOS_HISTORIAL.resumen} onPress={() => router.push('/resumen')} />
              <IconButton icon="download-outline" accessibilityLabel={TEXTOS_HISTORIAL.exportarTitulo} onPress={() => router.push('/exportar')} />
            </>
          }
        />
      </SafeAreaView>

      <FlatList
        data={visibles}
        keyExtractor={(factura) => String(factura.id)}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={encabezado}
        ListEmptyComponent={vacio}
        renderItem={({ item }) => (
          <FacturaListItem
            factura={item}
            onPress={() => router.push({ pathname: '/detalle/[id]', params: { id: String(item.id) } })}
          />
        )}
      />

      {visibles.length > 0 ? (
        <SafeAreaView style={styles.footer} edges={['bottom']}>
          <View style={styles.footerContent}>
            <SecondaryButton
              label={TEXTOS_HISTORIAL.exportar}
              onPress={() => router.push({ pathname: '/exportar', params: { periodo: historial.periodo } })}
            />
          </View>
        </SafeAreaView>
      ) : null}
    </View>
  );
}
