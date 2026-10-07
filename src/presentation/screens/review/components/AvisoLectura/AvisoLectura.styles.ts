import { StyleSheet } from 'react-native';

import { colors, fontSize, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.warningSurface,
  },
  text: {
    flex: 1,
    fontSize: fontSize.label,
    lineHeight: 18,
    color: colors.warningText,
  },
});
