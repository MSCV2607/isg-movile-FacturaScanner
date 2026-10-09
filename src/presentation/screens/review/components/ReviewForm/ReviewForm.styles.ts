import { StyleSheet } from 'react-native';

import { colors, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
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
