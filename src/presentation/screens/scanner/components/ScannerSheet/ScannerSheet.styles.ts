import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  sheet: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.surface,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
  },
  chipError: {
    backgroundColor: colors.dangerSurface,
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  chipDotError: {
    backgroundColor: colors.danger,
  },
  chipText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  chipTextError: {
    color: colors.danger,
  },
  title: {
    fontSize: fontSize.button,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  detail: {
    fontSize: fontSize.label,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  action: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
