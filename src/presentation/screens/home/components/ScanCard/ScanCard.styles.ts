import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  card: {
    height: 236,
    padding: spacing.xl,
    borderRadius: radius.xxl,
    backgroundColor: colors.primaryDark,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  cardPressed: {
    opacity: 0.92,
  },
  decoration: {
    position: 'absolute',
    top: -70,
    right: -70,
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 30,
    borderColor: colors.decoration,
  },
  iconTile: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  texts: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: fontSize.headline,
    fontWeight: fontWeight.extrabold,
    color: colors.onPrimary,
  },
  subtitle: {
    fontSize: fontSize.label,
    lineHeight: 19,
    color: colors.onPrimaryMuted,
  },
  arrowButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
