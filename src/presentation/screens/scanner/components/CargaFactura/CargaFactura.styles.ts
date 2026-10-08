import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

const DIAMETRO_ANILLO = 168;
const GROSOR_ANILLO = 10;
const DIAMETRO_ICONO = 100;
const ALTO_PUNTO = 8;
const ANCHO_PUNTO_ACTIVO = 24;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  contenido: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxl,
  },
  anillo: {
    width: DIAMETRO_ANILLO,
    height: DIAMETRO_ANILLO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anilloFondo: {
    position: 'absolute',
    width: DIAMETRO_ANILLO,
    height: DIAMETRO_ANILLO,
    borderRadius: DIAMETRO_ANILLO / 2,
    borderWidth: GROSOR_ANILLO,
    borderColor: colors.onPrimarySubtle,
  },
  anilloArco: {
    position: 'absolute',
    width: DIAMETRO_ANILLO,
    height: DIAMETRO_ANILLO,
    borderRadius: DIAMETRO_ANILLO / 2,
    borderWidth: GROSOR_ANILLO,
    borderColor: 'transparent',
    borderTopColor: colors.accent,
  },
  anilloIcono: {
    width: DIAMETRO_ICONO,
    height: DIAMETRO_ICONO,
    borderRadius: DIAMETRO_ICONO / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.decoration,
  },
  textos: {
    alignItems: 'center',
    gap: spacing.md,
  },
  titulo: {
    fontSize: fontSize.headline,
    fontWeight: fontWeight.extrabold,
    color: colors.onPrimary,
    textAlign: 'center',
  },
  mensaje: {
    minHeight: 24,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.accent,
    textAlign: 'center',
  },
  puntos: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  punto: {
    width: ALTO_PUNTO,
    height: ALTO_PUNTO,
    borderRadius: ALTO_PUNTO / 2,
    backgroundColor: colors.onPrimarySubtle,
  },
  puntoActivo: {
    width: ANCHO_PUNTO_ACTIVO,
    backgroundColor: colors.accent,
  },
  pie: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  detalle: {
    maxWidth: 280,
    fontSize: fontSize.label,
    lineHeight: 20,
    color: colors.onPrimaryMuted,
    textAlign: 'center',
  },
  botonCancelar: {
    minHeight: 48,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.onPrimaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonCancelarPresionado: {
    backgroundColor: colors.onPrimarySubtle,
  },
  etiquetaCancelar: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.onPrimary,
  },
});
