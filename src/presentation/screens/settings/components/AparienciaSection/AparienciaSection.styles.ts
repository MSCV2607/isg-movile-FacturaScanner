import { StyleSheet } from 'react-native';

import { colors, fontSize, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  nota: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
});
