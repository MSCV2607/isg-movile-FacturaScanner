import { StyleSheet } from 'react-native';

import { colors, fontSize, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  toggle: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleIcon: {
    fontSize: fontSize.button,
    color: colors.primary,
  },
  list: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  option: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  optionPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  optionText: {
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
});
