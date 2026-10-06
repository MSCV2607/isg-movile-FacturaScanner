import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, fontWeight, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  value: {
    flexShrink: 1,
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.mono,
    color: colors.textPrimary,
    textAlign: 'right',
  },
});
