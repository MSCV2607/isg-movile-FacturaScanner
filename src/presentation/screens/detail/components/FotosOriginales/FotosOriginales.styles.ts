import { StyleSheet } from 'react-native';

import { colors, fontSize, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  empty: {
    fontSize: fontSize.label,
    color: colors.textSecondary,
  },
  thumbs: {
    gap: spacing.sm,
  },
  thumb: {
    width: 76,
    height: 100,
    borderRadius: radius.md - spacing.xs,
    backgroundColor: colors.borderLight,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
  loading: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hintText: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
});
