import { ResumenFactura } from '../entities/ResumenFactura';
import { normalizarTexto } from './texto';

const rellenar = (valor: number, largo: number) => String(valor).padStart(largo, '0');

/** Todo lo que se puede buscar de una factura, junto y sin tildes: razón social, CUIT, número y categoría. */
function textoBuscable(factura: ResumenFactura): string {
  const cuit = factura.cuitEmisor;
  const cuitConGuiones = /^\d{11}$/.test(cuit) ? `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}` : cuit;
  const puntoVenta = rellenar(factura.puntoVenta, 4);
  const numero = rellenar(factura.numero, 8);

  return normalizarTexto(
    [
      factura.razonSocial,
      cuit,
      cuitConGuiones,
      `${factura.letra} ${puntoVenta}-${numero}`,
      `${puntoVenta}${numero}`,
      String(factura.numero),
      factura.categoria,
      factura.medioPago,
      factura.notas,
    ].join(' '),
  );
}

/** Deja las facturas que contienen todas las palabras escritas (en cualquier orden). Sin texto, las deja todas. */
export function filtrarPorTexto(facturas: ResumenFactura[], texto: string): ResumenFactura[] {
  const palabras = normalizarTexto(texto).split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return facturas;

  return facturas.filter((factura) => {
    const buscable = textoBuscable(factura);
    return palabras.every((palabra) => buscable.includes(palabra));
  });
}

/** Marca para filtrar las facturas sin categoría (o sin medio de pago). */
export const FILTRO_SIN_VALOR = '__sin_valor__';

export interface FiltrosHistorial {
  texto: string;
  /** Categoría exacta, FILTRO_SIN_VALOR para las que no tienen, o null para no filtrar. */
  categoria: string | null;
  medioPago: string | null;
}

const coincide = (valor: string, filtro: string | null) =>
  filtro === null || (filtro === FILTRO_SIN_VALOR ? valor === '' : valor === filtro);

/** Aplica la búsqueda de texto y los filtros de categoría y medio de pago. */
export function filtrarFacturas(facturas: ResumenFactura[], filtros: FiltrosHistorial): ResumenFactura[] {
  return filtrarPorTexto(facturas, filtros.texto).filter(
    (factura) => coincide(factura.categoria, filtros.categoria) && coincide(factura.medioPago, filtros.medioPago),
  );
}
