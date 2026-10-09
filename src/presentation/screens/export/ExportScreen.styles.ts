import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

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
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  sectionTitle: {
    fontSize: fontSize.button,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  message: {
    fontSize: fontSize.caption,
    lineHeight: 17,
    color: colors.textSecondary,
  },
  summary: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  summaryText: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  summaryNote: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  switchTexts: {
    flex: 1,
    gap: spacing.xs,
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  resultOk: {
    backgroundColor: colors.successSurface,
  },
  resultError: {
    backgroundColor: colors.dangerSurface,
  },
  resultText: {
    flex: 1,
    fontSize: fontSize.label,
    lineHeight: 18,
  },
  resultTextOk: {
    color: colors.success,
  },
  resultTextError: {
    color: colors.danger,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  footerContent: {
    gap: spacing.sm,
    padding: spacing.gutter,
  },
});
