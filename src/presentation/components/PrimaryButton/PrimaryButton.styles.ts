import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius } from '@presentation/theme';

export const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  label: {
    fontSize: fontSize.button,
    fontWeight: fontWeight.bold,
    color: colors.onPrimary,
  },
});
