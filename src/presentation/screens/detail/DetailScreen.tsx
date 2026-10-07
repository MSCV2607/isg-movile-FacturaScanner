import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatearFechaHora } from '@core/utils/formatters';
import { PurpleHeader } from '@presentation/components/PurpleHeader';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { useDetalleFactura } from '@presentation/hooks/useDetalleFactura';
import { colors } from '@presentation/theme';

import { AccionesExportar } from './components/AccionesExportar';
import { DatosComprobante } from './components/DatosComprobante';
import { EmisorResumen } from './components/EmisorResumen';
import { FotosOriginales } from './components/FotosOriginales';
import { ItemsDetalle } from './components/ItemsDetalle';
import { VisorFotos } from './components/VisorFotos';
import { styles } from './DetailScreen.styles';

export function DetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const detalle = useDetalleFactura(Number(id));
  const { factura } = detalle;

  const subtitulo = factura ? `Guardada · ${formatearFechaHora(factura.creadaEn)}` : undefined;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.headerArea} edges={['top']}>
        <PurpleHeader
          title="Detalle de factura"
          subtitle={subtitulo}
          showDot
          onBackPress={() => router.back()}
        />
      </SafeAreaView>

      {detalle.cargando ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : !factura ? (
        <View style={styles.centered}>
          <Text style={styles.message}>
            {detalle.hayError ? 'No se pudo cargar la factura.' : 'Esta factura ya no existe.'}
          </Text>
          <SecondaryButton label="Volver" onPress={() => router.back()} />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <EmisorResumen factura={factura.factura} />
            <DatosComprobante factura={factura.factura} />
            <ItemsDetalle factura={factura.factura} />
            <FotosOriginales
              cantidad={factura.fotos.length}
              uris={factura.fotos}
              descargando={detalle.accionEnCurso === 'fotos'}
              onVerFotos={detalle.abrirFotos}
              onDescargar={detalle.descargarFotos}
            />
            <AccionesExportar
              accionEnCurso={detalle.accionEnCurso}
              onExcel={detalle.exportarExcel}
              onCompartir={detalle.compartir}
              onProximamente={detalle.avisarProximamente}
            />
          </ScrollView>
          <VisorFotos visible={detalle.verFotos} uris={factura.fotos} onClose={detalle.cerrarFotos} />
        </>
      )}
    </View>
  );
}
