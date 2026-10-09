import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from 'pdf-lib';

import { formatearMonto } from '@core/utils/formatters';
import { FilaReporte, reporteFilasMapper } from '@data/mappers/reporteFilasMapper';
import { ReportePeriodo } from '@domain/entities/ReportePeriodo';

import { ArchivoReporte, GeneradorReporteDataSource } from './GeneradorReporteDataSource';

// A4 apaisado, en puntos.
const ANCHO = 841.89;
const ALTO = 595.28;
const MARGEN = 40;
const ALTO_FILA = 20;
const TAMANO_TEXTO = 9;
const TAMANO_TITULO = 16;

interface Columna {
  titulo: string;
  ancho: number;
  alineacion: 'izquierda' | 'derecha';
  valor: (fila: FilaReporte) => string;
}

const COLUMNAS: Columna[] = [
  { titulo: 'Fecha', ancho: 58, alineacion: 'izquierda', valor: (f) => f.fecha },
  { titulo: 'Tipo', ancho: 70, alineacion: 'izquierda', valor: (f) => f.tipo },
  { titulo: 'Comprobante', ancho: 100, alineacion: 'izquierda', valor: (f) => f.comprobante },
  { titulo: 'Razón social', ancho: 180, alineacion: 'izquierda', valor: (f) => f.razonSocial },
  { titulo: 'CUIT', ancho: 82, alineacion: 'izquierda', valor: (f) => f.cuit },
  { titulo: 'Categoría', ancho: 82, alineacion: 'izquierda', valor: (f) => f.categoria },
  { titulo: 'IVA', ancho: 72, alineacion: 'derecha', valor: (f) => importeConMoneda(f, f.iva) },
  { titulo: 'Total', ancho: 82, alineacion: 'derecha', valor: (f) => importeConMoneda(f, f.total) },
];

const GRIS_FONDO = rgb(0.93, 0.93, 0.95);
const GRIS_LINEA = rgb(0.82, 0.82, 0.86);
const TEXTO = rgb(0.1, 0.1, 0.14);
const TEXTO_SUAVE = rgb(0.4, 0.4, 0.46);

function importeConMoneda(fila: FilaReporte, valor: number): string {
  const signo = valor < 0 ? '-' : '';
  const simbolo = fila.moneda === 'ARS' ? '$' : fila.moneda;
  return `${signo}${simbolo} ${formatearMonto(Math.abs(valor))}`;
}

/** Las fuentes estándar del PDF solo escriben Latin-1: lo que no entra se reemplaza para que no falle. */
function aTextoPdf(texto: string): string {
  return [...texto.replace(/[\r\n\t]+/g, ' ')].map((c) => ((c.codePointAt(0) as number) <= 255 ? c : '?')).join('');
}

/** Recorta con "…" (como "...") hasta que el texto entre en el ancho disponible. */
function ajustar(texto: string, fuente: PDFFont, ancho: number): string {
  const limpio = aTextoPdf(texto);
  if (fuente.widthOfTextAtSize(limpio, TAMANO_TEXTO) <= ancho) return limpio;
  let recortado = limpio;
  while (recortado.length > 1 && fuente.widthOfTextAtSize(`${recortado}...`, TAMANO_TEXTO) > ancho) {
    recortado = recortado.slice(0, -1);
  }
  return `${recortado}...`;
}

/** Listado en PDF apaisado, con encabezado repetido en cada hoja y el total al final. */
export class ReportePdfDataSource implements GeneradorReporteDataSource {
  async generar(reporte: ReportePeriodo): Promise<ArchivoReporte> {
    const documento = await PDFDocument.create();
    const normal = await documento.embedFont(StandardFonts.Helvetica);
    const negrita = await documento.embedFont(StandardFonts.HelveticaBold);

    const filas = reporteFilasMapper.toFilas(reporte.facturas);
    const totales = reporteFilasMapper.totales(filas);

    let pagina = this.nuevaPagina(documento);
    let y = this.encabezadoDePagina(pagina, negrita, normal, reporte, filas.length);
    y = this.filaDeTitulos(pagina, negrita, y);

    for (const fila of filas) {
      if (y - ALTO_FILA < MARGEN) {
        pagina = this.nuevaPagina(documento);
        y = ALTO - MARGEN;
        y = this.filaDeTitulos(pagina, negrita, y);
      }
      y = this.filaDeDatos(pagina, normal, y, fila);
    }

    if (y - ALTO_FILA * 2 < MARGEN) {
      pagina = this.nuevaPagina(documento);
      y = ALTO - MARGEN;
    }
    this.filaDeTotal(pagina, negrita, normal, y, totales.iva, totales.total, totales.cantidadOtraMoneda);

    return {
      nombre: `${reporte.nombreBase}.pdf`,
      tipoMime: 'application/pdf',
      base64: await documento.saveAsBase64(),
    };
  }

  private nuevaPagina(documento: PDFDocument): PDFPage {
    return documento.addPage([ANCHO, ALTO]);
  }

  /** Título y subtítulo de la primera hoja. Devuelve la altura donde sigue la tabla. */
  private encabezadoDePagina(pagina: PDFPage, negrita: PDFFont, normal: PDFFont, reporte: ReportePeriodo, cantidad: number): number {
    const arriba = ALTO - MARGEN;
    pagina.drawText(aTextoPdf(reporte.titulo), { x: MARGEN, y: arriba - TAMANO_TITULO, size: TAMANO_TITULO, font: negrita, color: TEXTO });
    pagina.drawText(`${cantidad} ${cantidad === 1 ? 'comprobante' : 'comprobantes'}`, {
      x: MARGEN,
      y: arriba - TAMANO_TITULO - 16,
      size: TAMANO_TEXTO + 1,
      font: normal,
      color: TEXTO_SUAVE,
    });
    return arriba - TAMANO_TITULO - 36;
  }

  private filaDeTitulos(pagina: PDFPage, negrita: PDFFont, yArriba: number): number {
    pagina.drawRectangle({ x: MARGEN, y: yArriba - ALTO_FILA, width: ANCHO - MARGEN * 2, height: ALTO_FILA, color: GRIS_FONDO });
    this.escribirCeldas(pagina, negrita, yArriba, COLUMNAS.map((c) => c.titulo));
    return yArriba - ALTO_FILA;
  }

  private filaDeDatos(pagina: PDFPage, fuente: PDFFont, yArriba: number, fila: FilaReporte): number {
    this.escribirCeldas(pagina, fuente, yArriba, COLUMNAS.map((c) => c.valor(fila)));
    const yLinea = yArriba - ALTO_FILA;
    pagina.drawLine({ start: { x: MARGEN, y: yLinea }, end: { x: ANCHO - MARGEN, y: yLinea }, thickness: 0.5, color: GRIS_LINEA });
    return yLinea;
  }

  private filaDeTotal(pagina: PDFPage, negrita: PDFFont, normal: PDFFont, yArriba: number, iva: number, total: number, otraMoneda: number): void {
    const celdas = COLUMNAS.map((_, indice) => {
      if (indice === 0) return 'Total en pesos';
      if (indice === COLUMNAS.length - 2) return importeConMoneda({ moneda: 'ARS' } as FilaReporte, iva);
      if (indice === COLUMNAS.length - 1) return importeConMoneda({ moneda: 'ARS' } as FilaReporte, total);
      return '';
    });
    this.escribirCeldas(pagina, negrita, yArriba, celdas);
    if (otraMoneda > 0) {
      pagina.drawText(
        aTextoPdf(`No incluye ${otraMoneda} ${otraMoneda === 1 ? 'comprobante' : 'comprobantes'} en otra moneda.`),
        { x: MARGEN, y: yArriba - ALTO_FILA - 4, size: TAMANO_TEXTO, font: normal, color: TEXTO_SUAVE },
      );
    }
  }

  private escribirCeldas(pagina: PDFPage, fuente: PDFFont, yArriba: number, textos: string[]): void {
    let x = MARGEN;
    COLUMNAS.forEach((columna, indice) => {
      const disponible = columna.ancho - 8;
      const texto = ajustar(textos[indice], fuente, disponible);
      const ancho = fuente.widthOfTextAtSize(texto, TAMANO_TEXTO);
      pagina.drawText(texto, {
        x: columna.alineacion === 'derecha' ? x + columna.ancho - 4 - ancho : x + 4,
        y: yArriba - ALTO_FILA + 7,
        size: TAMANO_TEXTO,
        font: fuente,
        color: TEXTO,
      });
      x += columna.ancho;
    });
  }
}
