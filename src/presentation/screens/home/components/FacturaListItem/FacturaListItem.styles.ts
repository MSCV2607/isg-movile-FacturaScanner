import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  cardPressed: {
    opacity: 0.7,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    gap: 2,
  },
  comprobante: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  razonSocial: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  meta: {
    fontSize: fontSize.tiny,
    fontFamily: fontFamily.mono,
    color: colors.textSecondary,
  },
  summary: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  importe: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.mono,
    color: colors.textPrimary,
  },
});
