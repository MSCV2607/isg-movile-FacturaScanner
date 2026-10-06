import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  companyLogo: {
    width: 210,
    height: 25,
  },
  hero: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  appLogo: {
    width: 260,
    height: 212,
  },
  tagline: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  cardTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
  },
  version: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
