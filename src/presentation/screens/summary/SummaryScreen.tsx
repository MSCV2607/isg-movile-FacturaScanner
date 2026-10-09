import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatearImporte } from '@core/utils/formatters';
import { PurpleHeader } from '@presentation/components/PurpleHeader';
import { useResumenMensual } from '@presentation/hooks/useResumenMensual';
import { colors } from '@presentation/theme';

import { EvolucionMensual } from './components/EvolucionMensual';
import { GastoPorCategoria } from './components/GastoPorCategoria';
import { SelectorMes } from './components/SelectorMes';
import { TopProveedores } from './components/TopProveedores';
import { styles } from './SummaryScreen.styles';
import { TEXTOS_RESUMEN } from './SummaryScreen.textos';

export function SummaryScreen() {
  const router = useRouter();
  const { nombreMes, resumen, evolucion, variacion, isLoading, hasError, puedeAvanzar, irAlMesAnterior, irAlMesSiguiente } = useResumenMensual();

  const excedidas = resumen.categorias.filter((categoria) => categoria.estadoTope === 'excedido');
  const sinDatos = resumen.cantidad === 0 && resumen.cantidadOtraMoneda === 0;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.headerArea} edges={['top']}>
        <PurpleHeader title={TEXTOS_RESUMEN.titulo} subtitle={nombreMes} onBackPress={() => router.back()} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        <SelectorMes
          nombreMes={nombreMes}
          puedeAvanzar={puedeAvanzar}
          onAnterior={irAlMesAnterior}
          onSiguiente={irAlMesSiguiente}
        />

        {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
        {hasError ? <Text style={styles.message}>{TEXTOS_RESUMEN.errorCarga}</Text> : null}
        {!isLoading && !hasError && sinDatos ? <Text style={styles.message}>{TEXTOS_RESUMEN.vacio}</Text> : null}

        {!isLoading && !hasError && !sinDatos ? (
          <>
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>{TEXTOS_RESUMEN.total}</Text>
              <Text style={styles.totalValue}>{formatearImporte(resumen.total)}</Text>
              <Text style={styles.totalDetail}>
                {`${TEXTOS_RESUMEN.facturas(resumen.cantidad)} · ${TEXTOS_RESUMEN.iva(formatearImporte(resumen.iva))}`}
              </Text>
              {resumen.cantidadOtraMoneda > 0 ? (
                <Text style={styles.totalDetail}>{TEXTOS_RESUMEN.otraMoneda(resumen.cantidadOtraMoneda)}</Text>
              ) : null}
            </View>

            {excedidas.length > 0 ? (
              <Text style={styles.alerta}>{TEXTOS_RESUMEN.topeExcedido(excedidas.map((categoria) => categoria.categoria))}</Text>
            ) : null}

            {resumen.categorias.length > 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{TEXTOS_RESUMEN.porCategoria}</Text>
                <GastoPorCategoria categorias={resumen.categorias} />
              </View>
            ) : null}

            {evolucion.length > 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{TEXTOS_RESUMEN.evolucion}</Text>
                <EvolucionMensual meses={evolucion} variacion={variacion} />
              </View>
            ) : null}

            {resumen.proveedores.length > 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{TEXTOS_RESUMEN.proveedores}</Text>
                <TopProveedores proveedores={resumen.proveedores} />
              </View>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
