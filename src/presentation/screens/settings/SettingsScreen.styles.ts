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
    gap: spacing.xl,
  },
  about: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  companyLogo: {
    width: 140,
    height: 17,
  },
  version: {
    fontSize: fontSize.tiny,
    color: colors.textSecondary,
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
