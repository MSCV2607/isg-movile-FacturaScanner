import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, fontWeight, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  empty: {
    fontSize: fontSize.label,
    color: colors.textSecondary,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  itemTexts: {
    flex: 1,
    gap: 3,
  },
  descripcion: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  detalle: {
    fontSize: fontSize.tiny,
    fontFamily: fontFamily.mono,
    color: colors.textSecondary,
  },
  subtotal: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.mono,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
});
