import { CampoFactura } from '@domain/entities/Factura';
import { ResumenPrecisionIa } from '@domain/entities/RegistroLectura';

const ETIQUETA_CAMPO: Record<CampoFactura, string> = {
  razonSocial: 'razón social',
  cuitEmisor: 'CUIT',
  condicionFiscal: 'condición fiscal',
  puntoVenta: 'punto de venta',
  numero: 'número',
  fecha: 'fecha',
  importeNeto: 'neto',
  importeIva: 'IVA',
  importeTotal: 'total',
};

/** Líneas para mostrar la precisión de la lectura. Vacío si todavía no hay facturas leídas con IA. */
export function precisionIaTexto(resumen: ResumenPrecisionIa | null): string[] {
  if (!resumen || resumen.lecturas === 0) return [];

  const porcentaje = Math.round((resumen.sinCorrecciones / resumen.lecturas) * 100);
  const lineas = [
    `${resumen.sinCorrecciones} de ${resumen.lecturas} facturas se guardaron sin corregir nada (${porcentaje}%).`,
  ];

  if (resumen.camposMasCorregidos.length > 0) {
    const campos = resumen.camposMasCorregidos.map(({ campo, veces }) => `${ETIQUETA_CAMPO[campo]} (${veces})`);
    lineas.push(`Lo que más se corrige: ${campos.join(', ')}.`);
  }
  if (resumen.conSegundaPasada > 0) {
    lineas.push(`${resumen.conSegundaPasada} necesitaron una segunda lectura de la IA.`);
  }
  return lineas;
}
