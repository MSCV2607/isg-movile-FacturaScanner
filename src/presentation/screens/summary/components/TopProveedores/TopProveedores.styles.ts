import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, fontWeight, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  position: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionLabel: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  cuit: {
    fontSize: fontSize.tiny,
    fontFamily: fontFamily.mono,
    color: colors.textSecondary,
  },
  amount: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.mono,
    color: colors.textPrimary,
  },
});
