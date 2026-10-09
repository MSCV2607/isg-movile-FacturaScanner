import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  nota: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
});
