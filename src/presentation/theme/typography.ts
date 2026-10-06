export const fontSize = {
  tiny: 11,
  caption: 12,
  label: 13,
  body: 15,
  button: 16,
  title: 20,
  headline: 26,
} as const;

export const fontWeight = {
  regular: '400',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

export const fontFamily = {
  /** Para números e identificadores (CUIT, importes). */
  mono: 'monospace',
} as const;
