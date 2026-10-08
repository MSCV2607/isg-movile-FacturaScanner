import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCapturaFactura } from '@presentation/hooks/useCapturaFactura';

import { CargaFactura } from './components/CargaFactura';
import { ScanFrame } from './components/ScanFrame';
import { ScannerActions } from './components/ScannerActions';
import { ScannerHeader } from './components/ScannerHeader';
import { ScannerSheet, textosDelSheet } from './components/ScannerSheet';
import { styles } from './ScannerScreen.styles';

/**
 * El escaneo en sí lo hace el escáner de documentos del sistema, que se abre solo al entrar.
 * Esta pantalla acompaña el resto: muestra que se está abriendo, la lectura de las páginas, o qué falló.
 */
export function ScannerScreen() {
  const captura = useCapturaFactura();
  const analizando = captura.estado === 'analizando';

  const textos = textosDelSheet(captura.estado, captura.cantidadPaginas, captura.mensajeError, captura.qrDetectado);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <ScannerHeader onClose={captura.cancelar} procesando={analizando} />

        {analizando ? (
          <CargaFactura
            cantidadPaginas={captura.cantidadPaginas}
            qrDetectado={captura.qrDetectado}
            onCancelar={captura.cancelar}
          />
        ) : (
          <>
            <View style={styles.frameArea}>
              <ScanFrame />
            </View>

            <ScannerSheet textos={textos} conProblema={captura.estado === 'error'}>
              <ScannerActions
                estado={captura.estado}
                hayPaginas={captura.cantidadPaginas > 0}
                onReintentar={captura.reintentar}
                onEscanearDeNuevo={captura.escanearDeNuevo}
              />
            </ScannerSheet>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}
