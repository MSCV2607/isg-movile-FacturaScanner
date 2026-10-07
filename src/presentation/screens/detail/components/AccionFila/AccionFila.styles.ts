import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@presentation/theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowPressed: {
    opacity: 0.6,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTileVerde: {
    backgroundColor: colors.successSurface,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  descripcion: {
    fontSize: fontSize.caption,
    lineHeight: 17,
    color: colors.textSecondary,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 9,
    borderRadius: 10,
    backgroundColor: colors.warningSurface,
  },
  badgeText: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.bold,
    color: colors.warningText,
  },
});
