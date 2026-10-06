import { Animated } from 'react-native';

import { ALTO_MARCO } from './ScanFrame.styles';
import { styles } from './ScanLine.styles';
import { useLineaDeEscaneo } from './useLineaDeEscaneo';

export function ScanLine() {
  const estiloAnimado = useLineaDeEscaneo(ALTO_MARCO - 4);
  return <Animated.View style={[styles.line, estiloAnimado]} />;
}
