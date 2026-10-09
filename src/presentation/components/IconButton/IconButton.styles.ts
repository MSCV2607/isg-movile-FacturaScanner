import { StyleSheet } from 'react-native';

import { colors } from '@presentation/theme';

export const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.onPrimarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
