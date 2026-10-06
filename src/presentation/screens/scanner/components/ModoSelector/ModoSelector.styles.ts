import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    padding: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md - spacing.xs,
  },
  optionActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.onPrimary,
  },
});
