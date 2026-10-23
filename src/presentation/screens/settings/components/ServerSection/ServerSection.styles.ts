import { StyleSheet } from 'react-native';

import { colors, fontSize } from '@presentation/theme';

export const styles = StyleSheet.create({
  status: {
    fontSize: fontSize.caption,
    lineHeight: 17,
  },
  statusOk: {
    color: colors.success,
  },
  statusError: {
    color: colors.danger,
  },
  note: {
    fontSize: fontSize.caption,
    lineHeight: 17,
    color: colors.textSecondary,
  },
});
