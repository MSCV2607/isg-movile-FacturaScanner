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
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  texto: {
    fontSize: fontSize.label,
    color: colors.textSecondary,
  },
  resultado: {
    padding: spacing.lg,
    borderRadius: radius.md,
    fontSize: fontSize.label,
    fontWeight: fontWeight.semibold,
  },
  resultadoOk: {
    color: colors.success,
    backgroundColor: colors.successSurface,
  },
  resultadoError: {
    color: colors.danger,
    backgroundColor: colors.dangerSurface,
  },
});
