import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: colors.scrim,
    justifyContent: 'center',
    padding: spacing.gutter,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  iconTile: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
  },
  text: {
    fontSize: fontSize.body,
    lineHeight: 21,
    color: colors.textPrimary,
  },
  hint: {
    fontSize: fontSize.caption,
    lineHeight: 17,
    color: colors.textSecondary,
  },
  error: {
    fontSize: fontSize.label,
    lineHeight: 18,
    color: colors.danger,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
