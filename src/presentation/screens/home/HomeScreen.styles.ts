import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.gutter,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.button,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
  },
  message: {
    fontSize: fontSize.label,
    color: colors.textSecondary,
  },
});
