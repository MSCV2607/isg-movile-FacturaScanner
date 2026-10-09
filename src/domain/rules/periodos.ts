import { RangoFechas } from '../entities/RangoFechas';

/** Períodos que el usuario puede elegir para ver o exportar facturas. */
export type Periodo = 'mes' | 'mesAnterior' | 'ultimos3Meses' | 'todo';

const dosDigitos = (valor: number) => String(valor).padStart(2, '0');

const aFechaIso = (anio: number, mes: number, dia: number) => `${anio}-${dosDigitos(mes + 1)}-${dosDigitos(dia)}`;

/** Del día 1 al último día del mes. `mes` va de 0 (enero) a 11 (diciembre) y puede salirse de rango (-1 = diciembre anterior). */
export function rangoDelMes(anio: number, mes: number): RangoFechas {
  const primero = new Date(anio, mes, 1);
  const ultimoDia = new Date(anio, mes + 1, 0).getDate();
  return {
    desde: aFechaIso(primero.getFullYear(), primero.getMonth(), 1),
    hasta: aFechaIso(primero.getFullYear(), primero.getMonth(), ultimoDia),
  };
}

export function rangoDelPeriodo(periodo: Periodo, hoy: Date): RangoFechas {
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth();

  switch (periodo) {
    case 'mes':
      return rangoDelMes(anio, mes);
    case 'mesAnterior':
      return rangoDelMes(anio, mes - 1);
    case 'ultimos3Meses':
      return { desde: rangoDelMes(anio, mes - 2).desde, hasta: rangoDelMes(anio, mes).hasta };
    case 'todo':
      return { desde: null, hasta: null };
  }
}

const NOMBRES_MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

/** "Octubre 2026". `mes` va de 0 a 11 y puede salirse de rango (se acomoda al año). */
export function nombreDelMes(anio: number, mes: number): string {
  const fecha = new Date(anio, mes, 1);
  return `${NOMBRES_MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
}

/** Cómo se llama el período para el usuario. */
export function etiquetaDelPeriodo(periodo: Periodo, hoy: Date): string {
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth();
  switch (periodo) {
    case 'mes':
      return nombreDelMes(anio, mes);
    case 'mesAnterior':
      return nombreDelMes(anio, mes - 1);
    case 'ultimos3Meses':
      return 'Últimos 3 meses';
    case 'todo':
      return 'Todo el historial';
  }
}

/** Parte del nombre de archivo que identifica al período: "2026-10", "ultimos-3-meses", "todo". */
export function sufijoDelPeriodo(periodo: Periodo, hoy: Date): string {
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth();
  const delMes = (m: number) => {
    const fecha = new Date(anio, m, 1);
    return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}`;
  };
  switch (periodo) {
    case 'mes':
      return delMes(mes);
    case 'mesAnterior':
      return delMes(mes - 1);
    case 'ultimos3Meses':
      return 'ultimos-3-meses';
    case 'todo':
      return 'todo';
  }
}
