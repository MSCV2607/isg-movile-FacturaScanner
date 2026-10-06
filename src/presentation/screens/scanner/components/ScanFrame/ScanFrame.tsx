import { View } from 'react-native';

import { ScanLine } from './ScanLine';
import { styles } from './ScanFrame.styles';

type ScanFrameProps = {
  /** Muestra la línea de lectura en movimiento (mientras se recorre el ticket o se analiza). */
  escaneando: boolean;
};

// Marco con esquinas naranjas para encuadrar la factura completa.
export function ScanFrame({ escaneando }: ScanFrameProps) {
  return (
    <View style={styles.frame}>
      <View style={[styles.corner, styles.cornerTopLeft]} />
      <View style={[styles.corner, styles.cornerTopRight]} />
      <View style={[styles.corner, styles.cornerBottomLeft]} />
      <View style={[styles.corner, styles.cornerBottomRight]} />
      {escaneando ? <ScanLine /> : null}
    </View>
  );
}
