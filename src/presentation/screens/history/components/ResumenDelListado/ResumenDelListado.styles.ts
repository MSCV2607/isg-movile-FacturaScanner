import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: fontSize.label,
    color: colors.textSecondary,
  },
  total: {
    fontSize: fontSize.button,
    fontWeight: fontWeight.extrabold,
    fontFamily: fontFamily.mono,
    color: colors.textPrimary,
  },
  note: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
});
