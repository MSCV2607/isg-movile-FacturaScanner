import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  chip: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  chipPressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  labelSelected: {
    color: colors.onPrimary,
  },
});
