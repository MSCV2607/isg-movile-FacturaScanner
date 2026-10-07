import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight } from '@presentation/theme';

export const styles = StyleSheet.create({
  version: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  status: {
    fontSize: fontSize.caption,
    lineHeight: 17,
    color: colors.textSecondary,
  },
  statusOk: {
    color: colors.success,
  },
  statusError: {
    color: colors.danger,
  },
});
