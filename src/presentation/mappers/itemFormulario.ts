import { formatearMonto } from '@core/utils/formatters';
import { parsearImporte } from '@core/utils/parsers';
import { ItemFactura } from '@domain/entities/Factura';
import { redondear2 } from '@domain/rules/comprobante';

/** Alícuotas de IVA vigentes en Argentina que se ofrecen al editar un ítem. */
export const ALICUOTAS_IVA = [0, 10.5, 21, 27] as const;

/** Lo que se escribe al editar un ítem: todo texto. */
export interface FormularioItem {
  descripcion: string;
  cantidad: string;
  precioUnitario: string;
  /** Alícuota elegida, o null si el ítem no la tiene. */
  alicuotaIva: number | null;
}

export type ErroresItem = Partial<Record<'descripcion' | 'cantidad' | 'precioUnitario', string>>;

export const FORMULARIO_ITEM_VACIO: FormularioItem = {
  descripcion: '',
  cantidad: '1',
  precioUnitario: '',
  alicuotaIva: 21,
};

export function itemAFormulario(item: ItemFactura): FormularioItem {
  return {
    descripcion: item.descripcion,
    cantidad: String(item.cantidad).replace('.', ','),
    precioUnitario: formatearMonto(item.precioUnitario),
    alicuotaIva: item.alicuotaIva,
  };
}

export function validarItem(formulario: FormularioItem): ErroresItem {
  const errores: ErroresItem = {};
  if (formulario.descripcion.trim() === '') errores.descripcion = 'Escribí una descripción.';
  if (!(parsearImporte(formulario.cantidad) > 0)) errores.cantidad = 'Cantidad mayor a cero.';
  if (!(parsearImporte(formulario.precioUnitario) >= 0)) errores.precioUnitario = 'Precio inválido.';
  return errores;
}

/** Importe neto del ítem (cantidad × precio) y el IVA que le corresponde. 0 mientras falten datos. */
export function montosDelItem(formulario: FormularioItem): { neto: number; iva: number } {
  const cantidad = parsearImporte(formulario.cantidad);
  const precio = parsearImporte(formulario.precioUnitario);
  if (!Number.isFinite(cantidad) || !Number.isFinite(precio)) return { neto: 0, iva: 0 };

  const neto = redondear2(cantidad * precio);
  const iva = redondear2((neto * (formulario.alicuotaIva ?? 0)) / 100);
  return { neto, iva };
}

/** Pasa lo escrito a un ítem. Hay que haber validado antes (si no, devuelve valores en cero). */
export function formularioAItem(formulario: FormularioItem): ItemFactura {
  const cantidad = parsearImporte(formulario.cantidad);
  const precioUnitario = parsearImporte(formulario.precioUnitario);
  return {
    descripcion: formulario.descripcion.trim(),
    cantidad: Number.isFinite(cantidad) ? cantidad : 0,
    precioUnitario: Number.isFinite(precioUnitario) ? precioUnitario : 0,
    alicuotaIva: formulario.alicuotaIva,
    subtotal: montosDelItem(formulario).neto,
  };
}
