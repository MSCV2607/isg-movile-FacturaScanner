import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
    color: colors.textSecondary,
  },
  card: {
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
});
