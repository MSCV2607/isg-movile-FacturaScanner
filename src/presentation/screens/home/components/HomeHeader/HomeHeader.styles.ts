import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoTile: {
    width: 50,
    height: 50,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 32,
    height: 32,
  },
  greeting: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
  },
  appName: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  appNameBrand: {
    fontWeight: fontWeight.bold,
    color: colors.brandOrange,
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
