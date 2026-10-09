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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.gutter,
  },
  message: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
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
