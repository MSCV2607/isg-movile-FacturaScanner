import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius } from '@presentation/theme';

export const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCompact: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: radius.md,
  },
  buttonDanger: {
    borderColor: colors.danger,
  },
  buttonPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  label: {
    fontSize: fontSize.button,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  labelCompact: {
    fontSize: fontSize.label,
  },
  labelDanger: {
    color: colors.danger,
  },
});
