import { PROVEEDOR_IA } from './env';

const DATOS = {
  gemini: { nombre: 'Gemini', ejemploClave: 'AIza...' },
  anthropic: { nombre: 'Anthropic', ejemploClave: 'sk-ant-...' },
} as const;

/** Datos del servicio de IA elegido en `env.ts`, para mostrar en pantalla. */
export const PROVEEDOR_IA_ACTUAL = DATOS[PROVEEDOR_IA];
