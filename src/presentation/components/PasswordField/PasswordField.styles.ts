import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  toggle: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
});
