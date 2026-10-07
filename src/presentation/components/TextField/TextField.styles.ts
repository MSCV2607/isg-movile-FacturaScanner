import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  inputWrapper: {
    justifyContent: 'center',
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  inputWithAction: {
    paddingRight: 92,
  },
  inputDisabled: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderLight,
    color: colors.textSecondary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorMessage: {
    fontSize: fontSize.caption,
    color: colors.danger,
  },
  noteMessage: {
    fontSize: fontSize.caption,
    color: colors.warningText,
  },
  action: {
    position: 'absolute',
    right: spacing.xs,
  },
});
