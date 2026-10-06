import { StyleSheet } from 'react-native';

import { colors } from '@presentation/theme';

export const styles = StyleSheet.create({
  outer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerPressed: {
    opacity: 0.7,
  },
  inner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.accent,
  },
});
