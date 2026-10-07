import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Linking, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCapturaFactura } from '@presentation/hooks/useCapturaFactura';

import { ScanFrame } from './components/ScanFrame';
import { ScannerActions } from './components/ScannerActions';
import { ScannerHeader } from './components/ScannerHeader';
import { ScannerSheet, ScannerSheetEstado, textosDelSheet } from './components/ScannerSheet';
import { styles } from './ScannerScreen.styles';

export function ScannerScreen() {
  const router = useRouter();
  const captura = useCapturaFactura();

  const tienePermiso = captura.permiso?.granted === true;
  const estado: ScannerSheetEstado = !tienePermiso
    ? 'sin-permiso'
    : captura.analizando
      ? 'analizando'
      : captura.mensajeError
        ? 'error'
        : captura.automaticoActivo
          ? 'capturando'
          : captura.cantidadFotos > 0
            ? 'con-fotos'
            : 'lista';

  // Si el sistema ya no vuelve a preguntar, el permiso solo se cambia desde los ajustes.
  const permisoBloqueado = captura.permiso?.canAskAgain === false;
  const alPedirPermiso = permisoBloqueado ? Linking.openSettings : captura.pedirPermiso;

  const textos = textosDelSheet(estado, captura.modo, captura.cantidadFotos, captura.mensajeError, captura.qrDetectado);
  const conProblema = estado === 'error' || estado === 'sin-permiso';

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {tienePermiso ? (
        <CameraView
          ref={captura.camaraRef}
          style={styles.camera}
          facing="back"
          enableTorch={captura.linterna}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={captura.alLeerCodigo}
        />
      ) : null}

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <ScannerHeader
          linternaEncendida={captura.linterna}
          onClose={() => router.back()}
          onToggleLinterna={captura.alternarLinterna}
        />

        <View style={styles.frameArea}>
          <ScanFrame escaneando={captura.analizando || captura.automaticoActivo} />
        </View>

        <ScannerSheet textos={textos} conProblema={conProblema}>
          <ScannerActions
            estado={estado}
            modo={captura.modo}
            cantidadFotos={captura.cantidadFotos}
            permisoBloqueado={permisoBloqueado}
            onCambiarModo={captura.cambiarModo}
            onSacarFoto={captura.sacarFotoManual}
            onIniciarAutomatico={captura.iniciarAutomatico}
            onTerminar={captura.terminar}
            onReiniciar={captura.reiniciar}
            onPermisoPress={alPedirPermiso}
          />
        </ScannerSheet>
      </SafeAreaView>
    </View>
  );
}
