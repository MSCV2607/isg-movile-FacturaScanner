import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  content: {
    padding: spacing.gutter,
    gap: spacing.lg,
  },
  card: {
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cell: {
    flex: 1,
  },
  cellWide: {
    flex: 3,
  },
  cellNarrow: {
    flex: 2,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.gutter,
  },
  footerSecondary: {
    flex: 2,
  },
  footerPrimary: {
    flex: 3,
  },
});
