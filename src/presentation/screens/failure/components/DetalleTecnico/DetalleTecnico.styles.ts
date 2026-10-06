import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  card: {
    gap: 4,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.dangerSurface,
  },
  title: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.danger,
  },
  line: {
    fontSize: fontSize.label,
    fontFamily: fontFamily.mono,
    color: colors.textSecondary,
  },
  response: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.mono,
    color: colors.danger,
  },
});
