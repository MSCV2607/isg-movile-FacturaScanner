import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatearImporte } from '@core/utils/formatters';
import { Chip } from '@presentation/components/Chip';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { PurpleHeader } from '@presentation/components/PurpleHeader';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { useExportarPeriodo } from '@presentation/hooks/useExportarPeriodo';
import { OPCIONES_PERIODO, periodoDesdeParametro } from '@presentation/mappers/periodoOpciones';
import { colors } from '@presentation/theme';

import { styles } from './ExportScreen.styles';
import { FORMATOS, TEXTOS_EXPORTAR } from './ExportScreen.textos';

export function ExportScreen() {
  const router = useRouter();
  const { periodo: periodoParametro } = useLocalSearchParams<{ periodo?: string }>();
  const exportar = useExportarPeriodo(periodoDesdeParametro(periodoParametro, 'mes'));

  const sinFacturas = !exportar.isLoading && exportar.cantidad === 0;
  const bloqueado = exportar.isLoading || exportar.cantidad === 0;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.headerArea} edges={['top']}>
        <PurpleHeader title={TEXTOS_EXPORTAR.titulo} subtitle={TEXTOS_EXPORTAR.subtitulo} onBackPress={() => router.back()} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{TEXTOS_EXPORTAR.periodo}</Text>
          <View style={styles.chips}>
            {OPCIONES_PERIODO.map((opcion) => (
              <Chip
                key={opcion.valor}
                label={opcion.etiqueta}
                selected={exportar.periodo === opcion.valor}
                onPress={() => exportar.setPeriodo(opcion.valor)}
              />
            ))}
          </View>

          {exportar.isLoading ? <ActivityIndicator color={colors.primary} /> : null}
          {sinFacturas ? <Text style={styles.message}>{TEXTOS_EXPORTAR.vacio}</Text> : null}
          {!exportar.isLoading && exportar.cantidad > 0 ? (
            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                {TEXTOS_EXPORTAR.resumen(exportar.cantidad, formatearImporte(exportar.resumen.total))}
              </Text>
              {exportar.resumen.cantidadOtraMoneda > 0 ? (
                <Text style={styles.summaryNote}>{TEXTOS_EXPORTAR.otraMoneda(exportar.resumen.cantidadOtraMoneda)}</Text>
              ) : null}
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{TEXTOS_EXPORTAR.formato}</Text>
          <View style={styles.chips}>
            {FORMATOS.map((formato) => (
              <Chip
                key={formato.valor}
                label={formato.etiqueta}
                selected={exportar.formato === formato.valor}
                onPress={() => exportar.setFormato(formato.valor)}
              />
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchTexts}>
              <Text style={styles.sectionTitle}>{TEXTOS_EXPORTAR.fotos}</Text>
              <Text style={styles.message}>{TEXTOS_EXPORTAR.fotosAyuda}</Text>
            </View>
            <Switch
              value={exportar.conFotos}
              onValueChange={exportar.setConFotos}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
              accessibilityLabel={TEXTOS_EXPORTAR.fotos}
            />
          </View>
        </View>

        {exportar.resultado ? (
          <View style={[styles.result, exportar.resultado.tipo === 'error' ? styles.resultError : styles.resultOk]}>
            <Ionicons
              name={exportar.resultado.tipo === 'error' ? 'alert-circle' : 'checkmark-circle'}
              size={20}
              color={exportar.resultado.tipo === 'error' ? colors.danger : colors.success}
            />
            <Text style={[styles.resultText, exportar.resultado.tipo === 'error' ? styles.resultTextError : styles.resultTextOk]}>
              {exportar.resultado.mensaje}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <SafeAreaView style={styles.footer} edges={['bottom']}>
        <View style={styles.footerContent}>
          {exportar.conFotos ? (
            <PrimaryButton
              label={TEXTOS_EXPORTAR.guardarEnCarpeta}
              onPress={bloqueado ? undefined : exportar.guardarEnCarpeta}
              loading={exportar.exportando}
              rightIcon={<Ionicons name="folder-open-outline" size={18} color={colors.onPrimary} />}
            />
          ) : (
            <>
              <PrimaryButton
                label={TEXTOS_EXPORTAR.compartir}
                onPress={bloqueado ? undefined : exportar.compartir}
                loading={exportar.exportando}
                rightIcon={<Ionicons name="share-outline" size={18} color={colors.onPrimary} />}
              />
              <SecondaryButton label={TEXTOS_EXPORTAR.guardarEnCarpeta} onPress={bloqueado || exportar.exportando ? undefined : exportar.guardarEnCarpeta} />
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
