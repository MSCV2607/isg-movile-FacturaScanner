import { CorreccionCampo } from '../entities/RegistroLectura';
import { CampoFactura, Factura } from '../entities/Factura';
import { normalizarTexto } from './texto';

/** Cómo leer de una factura cada campo que el usuario puede corregir en la revisión. */
const LECTORES: Record<CampoFactura, (factura: Factura) => string | number> = {
  razonSocial: (f) => f.emisor.razonSocial,
  cuitEmisor: (f) => f.emisor.cuit,
  condicionFiscal: (f) => f.emisor.condicionFiscal,
  puntoVenta: (f) => f.puntoVenta,
  numero: (f) => f.numero,
  fecha: (f) => f.fecha,
  importeNeto: (f) => f.importeNeto,
  importeIva: (f) => f.importeIva,
  importeTotal: (f) => f.importeTotal,
};

/** Diferencia de importe que no cuenta como corrección (ruido de redondeo). */
const TOLERANCIA = 0.005;

function igual(a: string | number, b: string | number): boolean {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= TOLERANCIA;
  return normalizarTexto(String(a)) === normalizarTexto(String(b));
}

/** Los campos que el usuario cambió entre lo que se le mostró y lo que terminó guardando. */
export function correccionesDeLectura(mostrada: Factura, final: Factura): CorreccionCampo[] {
  const correcciones: CorreccionCampo[] = [];

  for (const campo of Object.keys(LECTORES) as CampoFactura[]) {
    const valorLeido = LECTORES[campo](mostrada);
    const valorFinal = LECTORES[campo](final);
    if (!igual(valorLeido, valorFinal)) {
      correcciones.push({ campo, valorLeido: String(valorLeido), valorFinal: String(valorFinal) });
    }
  }

  return correcciones;
}
