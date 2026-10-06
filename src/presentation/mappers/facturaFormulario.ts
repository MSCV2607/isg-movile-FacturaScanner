import {
  completarNumero,
  completarPuntoVenta,
  formatearCuit,
  formatearFechaIso,
  formatearMonto,
} from '@core/utils/formatters';
import { parsearFechaALaIso, parsearImporte, soloDigitos } from '@core/utils/parsers';
import { CampoFactura, Factura } from '@domain/entities/Factura';

/** Lo que se muestra y edita en pantalla: todo texto. */
export type FormularioFactura = Record<CampoFactura, string>;

export function facturaAFormulario(factura: Factura): FormularioFactura {
  return {
    razonSocial: factura.emisor.razonSocial,
    cuitEmisor: formatearCuit(factura.emisor.cuit),
    condicionFiscal: factura.emisor.condicionFiscal,
    puntoVenta: factura.puntoVenta > 0 ? completarPuntoVenta(factura.puntoVenta) : '',
    numero: factura.numero > 0 ? completarNumero(factura.numero) : '',
    fecha: formatearFechaIso(factura.fecha),
    importeNeto: formatearMonto(factura.importeNeto),
    importeIva: formatearMonto(factura.importeIva),
    importeTotal: formatearMonto(factura.importeTotal),
  };
}

/** Aplica lo editado sobre la factura leída (tipo, letra, moneda e ítems no se editan). */
export function formularioAFactura(formulario: FormularioFactura, base: Factura): Factura {
  return {
    ...base,
    emisor: {
      razonSocial: formulario.razonSocial.trim(),
      cuit: soloDigitos(formulario.cuitEmisor),
      condicionFiscal: formulario.condicionFiscal.trim(),
    },
    puntoVenta: Number(soloDigitos(formulario.puntoVenta) || NaN),
    numero: Number(soloDigitos(formulario.numero) || NaN),
    fecha: parsearFechaALaIso(formulario.fecha),
    importeNeto: parsearImporte(formulario.importeNeto),
    importeIva: parsearImporte(formulario.importeIva),
    importeTotal: parsearImporte(formulario.importeTotal),
  };
}
