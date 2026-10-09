import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerArea: {
    backgroundColor: colors.primaryDark,
  },
  content: {
    padding: spacing.gutter,
    gap: spacing.lg,
  },
  message: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  totalCard: {
    gap: spacing.xs,
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryDark,
  },
  totalLabel: {
    fontSize: fontSize.label,
    color: colors.onPrimaryMuted,
  },
  totalValue: {
    fontSize: fontSize.headline,
    fontWeight: fontWeight.extrabold,
    fontFamily: fontFamily.mono,
    color: colors.onPrimary,
  },
  totalDetail: {
    fontSize: fontSize.caption,
    color: colors.onPrimaryMuted,
  },
  card: {
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  cardTitle: {
    fontSize: fontSize.button,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
  },
});
