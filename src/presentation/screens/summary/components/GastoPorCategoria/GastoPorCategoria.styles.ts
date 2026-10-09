import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, fontWeight, spacing } from '@presentation/theme';

/** Ancho de la barra según el porcentaje (entre 0 y 100). Lo mínimo visible es 2% para que una categoría chica no desaparezca. */
export const anchoDeBarra = (porcentaje: number) => ({
  width: `${Math.min(100, Math.max(2, porcentaje))}%` as `${number}%`,
});

export const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  item: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  name: {
    flex: 1,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  amount: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.mono,
    color: colors.textPrimary,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  bar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  bar_sin: {},
  bar_ok: {},
  bar_cerca: {
    backgroundColor: colors.accent,
  },
  bar_excedido: {
    backgroundColor: colors.danger,
  },
  tope: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  tope_sin: {},
  tope_ok: {},
  tope_cerca: {
    color: colors.warningText,
  },
  tope_excedido: {
    color: colors.danger,
  },
  percent: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
});
