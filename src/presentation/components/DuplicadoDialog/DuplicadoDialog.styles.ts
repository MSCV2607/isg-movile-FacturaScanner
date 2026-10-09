import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

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
    backgroundColor: colors.warningSurface,
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
  table: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    flex: 2,
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  columnTitle: {
    flex: 3,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
  },
  value: {
    flex: 3,
    fontSize: fontSize.caption,
    fontFamily: fontFamily.mono,
    color: colors.textPrimary,
  },
  valueDifferent: {
    fontWeight: fontWeight.bold,
    color: colors.warningText,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
