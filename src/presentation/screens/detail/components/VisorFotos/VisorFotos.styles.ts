import { Dimensions, StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@presentation/theme';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  page: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width,
    height: height * 0.8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  counter: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    color: colors.onPrimary,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.onPrimarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
