import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
});
