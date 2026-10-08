import { View } from 'react-native';

import { styles } from './ScanFrame.styles';

// Marco con esquinas naranjas para encuadrar la factura completa.
export function ScanFrame() {
  return (
    <View style={styles.frame}>
      <View style={[styles.corner, styles.cornerTopLeft]} />
      <View style={[styles.corner, styles.cornerTopRight]} />
      <View style={[styles.corner, styles.cornerBottomLeft]} />
      <View style={[styles.corner, styles.cornerBottomRight]} />
    </View>
  );
}
