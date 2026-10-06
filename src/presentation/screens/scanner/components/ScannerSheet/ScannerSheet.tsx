import { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { styles } from './ScannerSheet.styles';
import { TextosSheet } from './ScannerSheet.textos';

type ScannerSheetProps = {
  textos: TextosSheet;
  /** Resalta el chip en rojo (errores y falta de permiso). */
  conProblema: boolean;
  /** Botones de acción de este estado. */
  children: ReactNode;
};

/** Hoja inferior del escáner: estado, título, detalle y las acciones disponibles. */
export function ScannerSheet({ textos, conProblema, children }: ScannerSheetProps) {
  return (
    <View style={styles.sheet}>
      <View style={[styles.chip, conProblema ? styles.chipError : null]}>
        <View style={[styles.chipDot, conProblema ? styles.chipDotError : null]} />
        <Text style={[styles.chipText, conProblema ? styles.chipTextError : null]}>{textos.chip}</Text>
      </View>

      <Text style={styles.title}>{textos.titulo}</Text>
      <Text style={styles.detail}>{textos.detalle}</Text>

      <View style={styles.action}>{children}</View>
    </View>
  );
}
