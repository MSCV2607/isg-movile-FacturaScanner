import { StyleSheet } from 'react-native';

import { colors } from '@presentation/theme';

export const styles = StyleSheet.create({
  line: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
});
