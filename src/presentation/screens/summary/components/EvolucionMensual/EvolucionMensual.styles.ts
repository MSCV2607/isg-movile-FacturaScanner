import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@presentation/theme';

const ALTO_PISTA = 110;

/** Altura de la barra proporcional al mayor mes; un mes con gasto siempre se ve (mínimo 4). */
export const alturaDeBarra = (total: number, maximo: number) => ({
  height: total > 0 && maximo > 0 ? Math.max(4, Math.round((total / maximo) * ALTO_PISTA)) : 0,
});

export const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  variacion: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
  },
  variacionSube: {
    color: colors.danger,
  },
  variacionBaja: {
    color: colors.success,
  },
  barras: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  columna: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  monto: {
    fontSize: fontSize.tiny,
    color: colors.textSecondary,
    height: 14,
  },
  pista: {
    height: ALTO_PISTA,
    width: '100%',
    justifyContent: 'flex-end',
  },
  barra: {
    width: '100%',
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  barraActual: {
    backgroundColor: colors.primary,
  },
  mes: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  mesActual: {
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
});
