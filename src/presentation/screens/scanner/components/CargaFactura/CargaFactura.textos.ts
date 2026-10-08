export const TITULO_CARGA = 'Estamos leyendo tu factura';
export const DETALLE_CARGA = 'Puede tardar unos segundos. Si querés, podés cancelar y volver a escanear.';
export const ETIQUETA_CANCELAR = 'Cancelar';

/** Mensajes que se van mostrando mientras se lee la factura (el último se mantiene hasta que termine). */
export function mensajesDeCarga(cantidadPaginas: number, qrDetectado: boolean): string[] {
  const mensajes: string[] = [];

  if (cantidadPaginas > 1) mensajes.push(`Uniendo ${cantidadPaginas} páginas…`);
  mensajes.push(qrDetectado ? 'QR de ARCA leído. Leyendo el resto…' : 'Identificando al emisor…');
  mensajes.push('Buscando importes e ítems…', 'Armando tu revisión…');

  return mensajes;
}
