import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  top: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  dot: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
  },
  title: {
    fontSize: fontSize.headline,
    fontWeight: fontWeight.extrabold,
    color: colors.onPrimary,
    textAlign: 'center',
  },
  message: {
    fontSize: fontSize.label,
    lineHeight: 19,
    color: colors.onPrimaryMuted,
    textAlign: 'center',
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.background,
  },
  sheetContent: {
    padding: spacing.gutter,
    gap: spacing.md,
  },
});
