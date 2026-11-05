import { DatosQrArca } from '../entities/DatosQrArca';
import { ExtraccionFactura } from '../entities/ExtraccionFactura';
import { CampoFactura, Factura } from '../entities/Factura';
import { ImagenFactura } from '../entities/ImagenFactura';
import { Discrepancia, LecturaFactura } from '../entities/LecturaFactura';
import { problemasDeLectura } from '../rules/problemasLectura';
import { ExtraerFacturaUseCase } from './ExtraerFacturaUseCase';

const importesDistintos = (a: number, b: number) => Math.abs(a - b) > 0.01;

/** Campos que, cuando hay QR de ARCA, salen del QR: la duda de la IA sobre ellos ya no importa. */
const CAMPOS_DEL_QR: CampoFactura[] = ['cuitEmisor', 'puntoVenta', 'numero', 'fecha', 'importeTotal'];

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
    categoria: '',
    medioPago: '',
    notas: '',
  };
}

/** El QR manda en lo que trae; lo que la IA leyó distinto se anota como discrepancia. */
function combinar(porIa: Factura, qr: DatosQrArca): { factura: Factura; discrepancias: Discrepancia[] } {
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
  return { factura, discrepancias };
}

/**
 * Lee una factura con la foto (IA) y, si se detectó, con su QR de ARCA.
 * - Con QR: sus datos mandan y la IA completa razón social, condición de IVA e ítems.
 * - Sin QR: la IA lee todo.
 * - Si lo que leyó la IA no cierra (CUIT inválido, neto + IVA distinto del total, ítems que no suman...),
 *   se le pide una segunda lectura de las mismas fotos diciéndole qué mirar. Se usa solo si mejora la primera.
 * - Si la IA falla pero hay QR: se guardan los datos del QR y el resto se completa a mano.
 */
export class LeerFacturaUseCase {
  /** `corregirConIa` = false apaga la segunda lectura (ahorra consultas a la IA). */
  constructor(
    private readonly extraer: ExtraerFacturaUseCase,
    private readonly corregirConIa: boolean = true,
  ) {}

  async ejecutar(imagenes: ImagenFactura[], qr: DatosQrArca | null): Promise<LecturaFactura> {
    let extraccion: ExtraccionFactura;
    try {
      extraccion = await this.extraer.ejecutar(imagenes);
    } catch (error) {
      if (!qr) throw error;
      const motivo = error instanceof Error ? error.message : 'No se pudo leer la factura con IA.';
      return {
        factura: facturaDesdeQr(qr),
        discrepancias: [],
        aviso: `${motivo} Se cargaron los datos del QR de ARCA: completá a mano la razón social, la condición fiscal y los importes.`,
        camposDudosos: [],
        registro: null,
      };
    }

    let segundaPasada = false;
    if (this.corregirConIa) {
      const corregida = await this.volverALeer(imagenes, qr, extraccion);
      if (corregida) {
        extraccion = corregida;
        segundaPasada = true;
      }
    }

    const { factura, discrepancias } = qr
      ? combinar(extraccion.factura, qr)
      : { factura: extraccion.factura, discrepancias: [] as Discrepancia[] };
    const camposDudosos = qr
      ? extraccion.camposDudosos.filter((campo) => !CAMPOS_DEL_QR.includes(campo))
      : extraccion.camposDudosos;

    return {
      factura,
      discrepancias,
      aviso: null,
      camposDudosos,
      registro: {
        proveedor: extraccion.proveedor,
        conQr: qr !== null,
        segundaPasada,
        camposDudosos,
        camposConDiscrepancia: discrepancias.map((discrepancia) => discrepancia.campo),
        mostrada: factura,
      },
    };
  }

  /**
   * Si la lectura tiene datos que no cierran, vuelve a leer las mismas fotos diciéndole a la IA qué revisar.
   * Devuelve la nueva lectura solo si tiene menos problemas que la anterior; si no, o si la consulta falla, null
   * (se sigue con la primera, que ya estaba bien para mostrarle al usuario).
   */
  private async volverALeer(
    imagenes: ImagenFactura[],
    qr: DatosQrArca | null,
    primera: ExtraccionFactura,
  ): Promise<ExtraccionFactura | null> {
    const problemas = problemasDeLectura(primera, qr);
    if (problemas.length === 0) return null;

    try {
      const segunda = await this.extraer.ejecutar(imagenes, problemas);
      return problemasDeLectura(segunda, qr).length < problemas.length ? segunda : null;
    } catch {
      return null;
    }
  }
}
