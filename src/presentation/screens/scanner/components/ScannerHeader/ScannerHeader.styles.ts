import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.md,
    backgroundColor: colors.scrim,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.onPrimarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    width: 44,
    height: 44,
  },
  title: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.onPrimary,
  },
});
