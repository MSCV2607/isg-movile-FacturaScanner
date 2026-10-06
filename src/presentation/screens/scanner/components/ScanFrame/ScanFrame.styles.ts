import { StyleSheet } from 'react-native';

import { colors } from '@presentation/theme';

export const ANCHO_MARCO = 280;
export const ALTO_MARCO = 380;
const LARGO_ESQUINA = 44;
const GROSOR_ESQUINA = 5;
const REDONDEO_ESQUINA = 18;

export const styles = StyleSheet.create({
  frame: {
    width: ANCHO_MARCO,
    height: ALTO_MARCO,
  },
  corner: {
    position: 'absolute',
    width: LARGO_ESQUINA,
    height: LARGO_ESQUINA,
    borderColor: colors.accent,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: GROSOR_ESQUINA,
    borderLeftWidth: GROSOR_ESQUINA,
    borderTopLeftRadius: REDONDEO_ESQUINA,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: GROSOR_ESQUINA,
    borderRightWidth: GROSOR_ESQUINA,
    borderTopRightRadius: REDONDEO_ESQUINA,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: GROSOR_ESQUINA,
    borderLeftWidth: GROSOR_ESQUINA,
    borderBottomLeftRadius: REDONDEO_ESQUINA,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: GROSOR_ESQUINA,
    borderRightWidth: GROSOR_ESQUINA,
    borderBottomRightRadius: REDONDEO_ESQUINA,
  },
});
