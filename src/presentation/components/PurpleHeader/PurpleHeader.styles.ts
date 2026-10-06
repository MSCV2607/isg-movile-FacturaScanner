import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    backgroundColor: colors.primaryDark,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.onPrimarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.extrabold,
    color: colors.onPrimary,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  subtitle: {
    fontSize: fontSize.caption,
    color: colors.onPrimaryMuted,
  },
});
