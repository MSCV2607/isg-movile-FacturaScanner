import { normalizarTexto } from './texto';

export const LARGO_MAXIMO_CATEGORIA = 24;

/** Nombre con el que se agrupan las facturas sin rubro. Nadie puede crear una categoría con este nombre. */
export const NOMBRE_SIN_CATEGORIA = 'Sin categoría';

/** Texto de error si el nombre no sirve para una categoría, o null si está bien. `actual` es el nombre que se está editando. */
export function validarNombreCategoria(nombre: string, existentes: string[], actual?: string): string | null {
  const limpio = nombre.trim();
  if (limpio === '') return 'Escribí un nombre para la categoría.';
  if (limpio.length > LARGO_MAXIMO_CATEGORIA) return `Usá hasta ${LARGO_MAXIMO_CATEGORIA} caracteres.`;

  const clave = normalizarTexto(limpio);
  if (clave === normalizarTexto(NOMBRE_SIN_CATEGORIA)) return `"${NOMBRE_SIN_CATEGORIA}" está reservado para las facturas sin rubro.`;

  const repetida = existentes.some((otra) => otra !== actual && normalizarTexto(otra) === clave);
  return repetida ? 'Ya existe una categoría con ese nombre.' : null;
}

/** Valida un tope mensual escrito por el usuario. null = sin tope; texto = error. */
export function validarTope(tope: number | null): string | null {
  if (tope === null) return null;
  return Number.isFinite(tope) && tope > 0 ? null : 'El tope tiene que ser mayor a cero.';
}
