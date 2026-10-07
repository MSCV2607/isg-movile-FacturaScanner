import { decodificarBase64 } from '@core/utils/base64';

import { DatosQrArca } from '../entities/DatosQrArca';

// Tipos de comprobante de ARCA: código → tipo y letra.
const COMPROBANTES: Record<number, { tipo: string; letra: string }> = {
  1: { tipo: 'Factura', letra: 'A' },
  2: { tipo: 'Nota de débito', letra: 'A' },
  3: { tipo: 'Nota de crédito', letra: 'A' },
  6: { tipo: 'Factura', letra: 'B' },
  7: { tipo: 'Nota de débito', letra: 'B' },
  8: { tipo: 'Nota de crédito', letra: 'B' },
  11: { tipo: 'Factura', letra: 'C' },
  12: { tipo: 'Nota de débito', letra: 'C' },
  13: { tipo: 'Nota de crédito', letra: 'C' },
  51: { tipo: 'Factura', letra: 'M' },
  52: { tipo: 'Nota de débito', letra: 'M' },
  53: { tipo: 'Nota de crédito', letra: 'M' },
  201: { tipo: 'Factura de crédito electrónica', letra: 'A' },
  202: { tipo: 'Nota de débito de crédito electrónica', letra: 'A' },
  203: { tipo: 'Nota de crédito de crédito electrónica', letra: 'A' },
  206: { tipo: 'Factura de crédito electrónica', letra: 'B' },
  207: { tipo: 'Nota de débito de crédito electrónica', letra: 'B' },
  208: { tipo: 'Nota de crédito de crédito electrónica', letra: 'B' },
  211: { tipo: 'Factura de crédito electrónica', letra: 'C' },
  212: { tipo: 'Nota de débito de crédito electrónica', letra: 'C' },
  213: { tipo: 'Nota de crédito de crédito electrónica', letra: 'C' },
};

// Códigos de moneda de ARCA → ISO.
const MONEDAS: Record<string, string> = {
  PES: 'ARS',
  DOL: 'USD',
  '060': 'EUR',
  '012': 'BRL',
  '021': 'GBP',
};

const DOMINIOS_ARCA = /^https?:\/\/[^/]*(afip|arca)\.gob\.ar\//i;

function fechaValida(fechaIso: string): boolean {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaIso);
  if (!partes) return false;
  const [anio, mes, dia] = [Number(partes[1]), Number(partes[2]), Number(partes[3])];
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
}

/**
 * Lee el texto de un QR y, si es el de una factura electrónica de ARCA
 * (`https://www.afip.gob.ar/fe/qr/?p=<JSON en base64>`), devuelve sus datos. Si no, null.
 */
export class LeerQrFacturaUseCase {
  ejecutar(texto: string): DatosQrArca | null {
    if (!DOMINIOS_ARCA.test(texto)) return null;
    const parametro = /[?&]p=([^&#\s]+)/.exec(texto);
    if (!parametro) return null;

    let datos: Record<string, unknown>;
    try {
      datos = JSON.parse(decodificarBase64(decodeURIComponent(parametro[1])));
    } catch {
      return null;
    }
    if (typeof datos !== 'object' || datos === null) return null;

    const cuit = String(datos.cuit ?? '').padStart(11, '0');
    const puntoVenta = Number(datos.ptoVta);
    const numero = Number(datos.nroCmp);
    const fecha = String(datos.fecha ?? '');
    const importeTotal = Number(datos.importe);

    if (!/^\d{11}$/.test(cuit)) return null;
    if (!Number.isInteger(puntoVenta) || puntoVenta < 1 || puntoVenta > 99999) return null;
    if (!Number.isInteger(numero) || numero < 1) return null;
    if (!fechaValida(fecha)) return null;
    if (!Number.isFinite(importeTotal) || importeTotal < 0) return null;

    const comprobante = COMPROBANTES[Number(datos.tipoCmp)];
    return {
      cuit,
      puntoVenta,
      numero,
      fecha,
      importeTotal,
      moneda: MONEDAS[String(datos.moneda ?? '')] ?? '',
      tipoComprobante: comprobante?.tipo ?? '',
      letra: comprobante?.letra ?? '',
    };
  }
}
