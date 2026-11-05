import { DatosQrArca } from '../entities/DatosQrArca';
import { ExtraccionFactura } from '../entities/ExtraccionFactura';
import { redondear2 } from './comprobante';
import { esCuitValido } from './cuit';
import { esFechaIsoValida } from './fechas';

/** Diferencia de centavos que se tolera por redondeos de la factura. */
const TOLERANCIA_IMPORTE = 0.05;
/** Diferencia (en pesos o en proporción) que se tolera entre la suma de los ítems y el encabezado. */
const TOLERANCIA_ITEMS_PESOS = 1;
const TOLERANCIA_ITEMS_PROPORCION = 0.02;

const cercanos = (a: number, b: number, referencia: number) =>
  Math.abs(a - b) <= Math.max(TOLERANCIA_ITEMS_PESOS, referencia * TOLERANCIA_ITEMS_PROPORCION);

/**
 * Datos de la lectura que no cierran o no tienen sentido. Cada uno es una frase para decirle a la IA,
 * con la foto delante, qué volver a mirar. Lista vacía = la lectura es coherente.
 *
 * Con QR de ARCA, el CUIT, el punto de venta, el número, la fecha y el total salen del QR: de esos datos
 * solo importa lo que ayuda a la IA a acertar el resto (por ejemplo, de qué empresa es la razón social).
 */
export function problemasDeLectura(extraccion: ExtraccionFactura, qr: DatosQrArca | null): string[] {
  const { factura, cuitReceptor, otrosTributos } = extraccion;
  const { emisor, items, importeNeto, importeIva } = factura;
  const problemas: string[] = [];

  if (qr) {
    if (emisor.cuit !== '' && emisor.cuit !== qr.cuit) {
      problemas.push(
        `El QR de ARCA indica que el CUIT del emisor es ${qr.cuit}, pero leíste ${emisor.cuit}. ` +
          `Tomá la razón social y la condición fiscal de la empresa con CUIT ${qr.cuit} (la que emite el comprobante).`,
      );
    }
  } else {
    if (emisor.cuit === '') {
      problemas.push('No se leyó el CUIT del emisor.');
    } else if (!esCuitValido(emisor.cuit)) {
      problemas.push(
        `El CUIT del emisor (${emisor.cuit}) no es válido: su último dígito no coincide con el verificador. Releé cada dígito.`,
      );
    }
    if (cuitReceptor !== '' && cuitReceptor === emisor.cuit) {
      problemas.push(
        'El CUIT del emisor y el del receptor son el mismo. El emisor es quien emite el comprobante (el encabezado); el receptor es el cliente.',
      );
    }
    if (!esFechaIsoValida(factura.fecha)) problemas.push('La fecha de emisión no se leyó o no es una fecha válida.');
    if (!Number.isInteger(factura.puntoVenta) || factura.puntoVenta < 1) problemas.push('No se leyó el punto de venta.');
    if (!Number.isInteger(factura.numero) || factura.numero < 1) problemas.push('No se leyó el número de comprobante.');
  }

  if (emisor.razonSocial === '') problemas.push('No se leyó la razón social del emisor (está en el encabezado).');

  // El total del QR es más confiable que el leído: con él se juzgan neto, IVA y otros tributos.
  const total = qr ? qr.importeTotal : factura.importeTotal;
  const origenTotal = qr ? ' (según el QR de ARCA)' : '';

  if (!(total > 0)) {
    problemas.push('No se leyó el importe total.');
  } else if (importeNeto !== 0 || importeIva !== 0) {
    const suma = redondear2(importeNeto + importeIva + otrosTributos);
    if (Math.abs(suma - total) > TOLERANCIA_IMPORTE) {
      problemas.push(
        `importe_neto (${importeNeto}) + importe_iva (${importeIva}) + importe_otros_tributos (${otrosTributos}) da ${suma}, ` +
          `pero el total del comprobante es ${total}${origenTotal}. Revisá cuál de los importes leíste mal.`,
      );
    }
  }

  // Los precios de los ítems pueden venir sin IVA (suman el neto) o con IVA (suman el total).
  if (items.length > 0 && importeNeto > 0) {
    const sumaItems = redondear2(items.reduce((suma, item) => suma + item.subtotal, 0));
    const coincideConNeto = cercanos(sumaItems, importeNeto, importeNeto);
    const coincideConTotal = total > 0 && cercanos(sumaItems, total, total);
    if (!coincideConNeto && !coincideConTotal) {
      problemas.push(
        `Los subtotales de los ítems suman ${sumaItems}, que no coincide con el neto (${importeNeto}) ni con el total (${total}). ` +
          'Puede faltar un ítem, haber uno repetido o un subtotal mal leído.',
      );
    }
  }

  return problemas;
}
