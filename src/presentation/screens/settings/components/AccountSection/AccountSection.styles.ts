import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: fontSize.button,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
  },
  name: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  detail: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
});
