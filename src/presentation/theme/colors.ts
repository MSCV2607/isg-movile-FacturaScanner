import { leerTema } from '@core/utils/preferenciaTema';

const claro = {
  background: '#F6F4FB',
  surface: '#FFFFFF',
  surfaceMuted: '#EFECF8',
  textPrimary: '#1D1833',
  textSecondary: '#5B5774',
  placeholder: '#8A84A3',
  border: '#B5AED0',
  borderLight: '#DCD7EC',
  primary: '#5E4D9F',
  primaryPressed: '#4F3F8A',
  primaryDark: '#35295F',
  onPrimary: '#FFFFFF',
  onPrimaryMuted: 'rgba(255, 255, 255, 0.86)',
  decoration: 'rgba(255, 255, 255, 0.07)',
  onPrimarySubtle: 'rgba(255, 255, 255, 0.16)',
  scrim: 'rgba(29, 24, 51, 0.6)',
  accent: '#F58E12',
  brandOrange: '#C25F00',
  success: '#135B3B',
  successSurface: '#E0F3EA',
  warningSurface: '#FDEBD3',
  warningText: '#7A3F00',
  danger: '#A12018',
  dangerSurface: '#FCE9E7',
  shadow: '#35295F',
} as const;

type Paleta = Record<keyof typeof claro, string>;

const oscuro: Paleta = {
  background: '#14111F',
  surface: '#1E1A2E',
  surfaceMuted: '#2A2540',
  textPrimary: '#F1EEFB',
  textSecondary: '#B9B3D1',
  placeholder: '#8A84A3',
  border: '#4A4366',
  borderLight: '#332E4D',
  primary: '#7560C8',
  primaryPressed: '#6650B5',
  primaryDark: '#241C45',
  onPrimary: '#FFFFFF',
  onPrimaryMuted: 'rgba(255, 255, 255, 0.86)',
  decoration: 'rgba(255, 255, 255, 0.07)',
  onPrimarySubtle: 'rgba(255, 255, 255, 0.16)',
  scrim: 'rgba(0, 0, 0, 0.7)',
  accent: '#F58E12',
  brandOrange: '#F0A04B',
  success: '#5FD3A0',
  successSurface: '#16352A',
  warningSurface: '#3D2B12',
  warningText: '#F5C98A',
  danger: '#FF8A80',
  dangerSurface: '#3D1D1B',
  shadow: '#000000',
};

// El tema se elige al abrir la app: cambiarlo en Configuración reinicia la app para aplicarlo.
export const tema = leerTema();
export const colors: Paleta = tema === 'oscuro' ? oscuro : claro;
