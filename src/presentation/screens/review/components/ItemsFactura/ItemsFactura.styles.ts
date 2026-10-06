import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, fontWeight, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  empty: {
    fontSize: fontSize.label,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  description: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  detail: {
    fontSize: fontSize.tiny,
    fontFamily: fontFamily.mono,
    color: colors.textSecondary,
  },
  subtotal: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.mono,
    color: colors.textPrimary,
  },
});
