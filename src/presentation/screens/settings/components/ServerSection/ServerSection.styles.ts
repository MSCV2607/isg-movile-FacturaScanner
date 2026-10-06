import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  testRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  status: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOk: {
    backgroundColor: colors.success,
  },
  dotError: {
    backgroundColor: colors.danger,
  },
  statusText: {
    flexShrink: 1,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.success,
  },
  statusTextError: {
    color: colors.danger,
  },
});
