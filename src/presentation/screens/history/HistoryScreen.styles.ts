import { StyleSheet } from 'react-native';

import { colors, fontSize, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerArea: {
    backgroundColor: colors.primaryDark,
  },
  content: {
    padding: spacing.gutter,
    gap: spacing.md,
  },
  filters: {
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  chips: {
    gap: spacing.sm,
  },
  empty: {
    gap: spacing.lg,
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  footerContent: {
    padding: spacing.gutter,
  },
});
