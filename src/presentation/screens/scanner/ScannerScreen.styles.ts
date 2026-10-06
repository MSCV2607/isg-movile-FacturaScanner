import { StyleSheet } from 'react-native';

import { colors } from '@presentation/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
  },
  frameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
