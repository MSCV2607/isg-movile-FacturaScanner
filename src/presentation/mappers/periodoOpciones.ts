import { Periodo } from '@domain/rules/periodos';

/** Períodos que se ofrecen al filtrar el historial y al exportar, en el orden en que se muestran. */
export const OPCIONES_PERIODO: { valor: Periodo; etiqueta: string }[] = [
  { valor: 'todo', etiqueta: 'Todo' },
  { valor: 'mes', etiqueta: 'Este mes' },
  { valor: 'mesAnterior', etiqueta: 'Mes anterior' },
  { valor: 'ultimos3Meses', etiqueta: 'Últimos 3 meses' },
];

const VALORES = OPCIONES_PERIODO.map((opcion) => opcion.valor as string);

/** Convierte un parámetro de ruta en un período; si no es uno conocido, devuelve el predeterminado. */
export function periodoDesdeParametro(parametro: string | string[] | undefined, predeterminado: Periodo): Periodo {
  const valor = Array.isArray(parametro) ? parametro[0] : parametro;
  return valor !== undefined && VALORES.includes(valor) ? (valor as Periodo) : predeterminado;
}
