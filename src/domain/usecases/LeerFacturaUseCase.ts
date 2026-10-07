import { DatosQrArca } from '../entities/DatosQrArca';
import { Factura } from '../entities/Factura';
import { ImagenFactura } from '../entities/ImagenFactura';
import { Discrepancia, LecturaFactura } from '../entities/LecturaFactura';
import { ExtraerFacturaUseCase } from './ExtraerFacturaUseCase';

const importesDistintos = (a: number, b: number) => Math.abs(a - b) > 0.01;

/** Factura con solo lo que trae el QR: el resto queda vacío para completarlo a mano. */
function facturaDesdeQr(qr: DatosQrArca): Factura {
  return {
    emisor: { razonSocial: '', cuit: qr.cuit, condicionFiscal: '' },
    tipoComprobante: qr.tipoComprobante || 'Factura',
    letra: qr.letra,
    puntoVenta: qr.puntoVenta,
    numero: qr.numero,
    fecha: qr.fecha,
    moneda: qr.moneda || 'ARS',
    items: [],
    importeNeto: 0,
    importeIva: 0,
    importeTotal: qr.importeTotal,
  };
}

/** El QR manda en lo que trae; lo que la IA leyó distinto se anota como discrepancia. */
function combinar(porIa: Factura, qr: DatosQrArca): LecturaFactura {
  const discrepancias: Discrepancia[] = [];

  if (porIa.emisor.cuit !== '' && porIa.emisor.cuit !== qr.cuit) {
    discrepancias.push({ campo: 'cuitEmisor', valorIa: porIa.emisor.cuit });
  }
  if (porIa.puntoVenta > 0 && porIa.puntoVenta !== qr.puntoVenta) {
    discrepancias.push({ campo: 'puntoVenta', valorIa: String(porIa.puntoVenta) });
  }
  if (porIa.numero > 0 && porIa.numero !== qr.numero) {
    discrepancias.push({ campo: 'numero', valorIa: String(porIa.numero) });
  }
  if (porIa.fecha !== '' && porIa.fecha !== qr.fecha) {
    discrepancias.push({ campo: 'fecha', valorIa: porIa.fecha });
  }
  if (porIa.importeTotal > 0 && importesDistintos(porIa.importeTotal, qr.importeTotal)) {
    discrepancias.push({ campo: 'importeTotal', valorIa: String(porIa.importeTotal) });
  }

  const factura: Factura = {
    ...porIa,
    emisor: { ...porIa.emisor, cuit: qr.cuit },
    tipoComprobante: qr.tipoComprobante || porIa.tipoComprobante,
    letra: qr.letra || porIa.letra,
    puntoVenta: qr.puntoVenta,
    numero: qr.numero,
    fecha: qr.fecha,
    moneda: qr.moneda || porIa.moneda,
    importeTotal: qr.importeTotal,
  };
  return { factura, discrepancias, aviso: null };
}

/**
 * Lee una factura con la foto (IA) y, si se detectó, con su QR de ARCA.
 * - Con QR: sus datos mandan y la IA completa razón social, condición de IVA e ítems.
 * - Sin QR: la IA lee todo.
 * - Si la IA falla pero hay QR: se guardan los datos del QR y el resto se completa a mano.
 */
export class LeerFacturaUseCase {
  constructor(private readonly extraer: ExtraerFacturaUseCase) {}

  async ejecutar(imagenes: ImagenFactura[], qr: DatosQrArca | null): Promise<LecturaFactura> {
    let porIa: Factura;
    try {
      porIa = await this.extraer.ejecutar(imagenes);
    } catch (error) {
      if (!qr) throw error;
      const motivo = error instanceof Error ? error.message : 'No se pudo leer la factura con IA.';
      return {
        factura: facturaDesdeQr(qr),
        discrepancias: [],
        aviso: `${motivo} Se cargaron los datos del QR de ARCA: completá a mano la razón social, la condición fiscal y los importes.`,
      };
    }

    return qr ? combinar(porIa, qr) : { factura: porIa, discrepancias: [], aviso: null };
  }
}
