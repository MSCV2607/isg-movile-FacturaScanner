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
  ayuda: {
    fontSize: fontSize.label,
    color: colors.textSecondary,
  },
  mensajeExito: {
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  errorGeneral: {
    fontSize: fontSize.caption,
    color: colors.danger,
    textAlign: 'center',
  },
  volver: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  volverTexto: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
});
