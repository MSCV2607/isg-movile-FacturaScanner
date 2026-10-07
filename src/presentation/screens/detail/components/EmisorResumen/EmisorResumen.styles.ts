import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, fontWeight, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  razonSocial: {
    fontSize: fontSize.button,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cuit: {
    fontSize: fontSize.label,
    fontFamily: fontFamily.mono,
    color: colors.textSecondary,
  },
  chip: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceMuted,
  },
  chipText: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.bold,
    color: colors.primaryPressed,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  total: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  totalLabel: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: fontSize.headline,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.mono,
    color: colors.textPrimary,
  },
});
